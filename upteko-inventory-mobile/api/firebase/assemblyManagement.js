import app from "./firebaseConfig";
import { getFirestore, doc, updateDoc, serverTimestamp, collection, onSnapshot, getDoc, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export const subscribeToAssemblyItems = (callback) => {
    const assemblyCollection = collection(db, "assembly");

    return onSnapshot(assemblyCollection, (snapshot) => {
        const assemblyItems = snapshot.docs.map(doc => ({
            imageURL: doc.data().imageURL,
            id: doc.id,
        }));
        callback(assemblyItems);
    }, (error) => {
        console.error('Error getting assembly items: ', error);
        throw error;
    });
};

export const subscribeToSubAssemblyItems = (assemblyId, callback) => {
    const subAssemblyCollection = collection(db, `assembly/${assemblyId}/subassembly`);

    return onSnapshot(subAssemblyCollection, (snapshot) => {
        const subAssemblyItems = snapshot.docs.map(doc => ({
            sku: doc.id,
            assembly: doc.data().assembly,
            name: doc.data().name,
            quantity: doc.data().quantity,
            minPoint: doc.data().min_point,
            location: doc.data().location,
            imageURL: doc.data().imageURL,
            dateCreated: doc.data().date_created,
            lastModified: doc.data().last_modified,
        }));
        callback(subAssemblyItems);
    }, (error) => {
        console.error('Error getting sub-assembly items: ', error);
        throw error;
    });
}

export const getMaterialsNeeded = async (assemblyId, subAssemblyId) => {
    try {
        const materialsNeededCollection = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/materials_needed`);
        const materialsNeededSnapshot = await getDocs(materialsNeededCollection);

        const materialsNeeded = materialsNeededSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity,
        }));
        
        return materialsNeeded;
    } catch (error) {
        console.error(`Error getting materials needed: ${error}`);
        throw error;
    }
}

export const getMaterialLocation = async (partId) => {
    try {
        const partDocRef = doc(db, "parts", partId);
        const partDocSnapshot = await getDoc(partDocRef)
        
        if (partDocSnapshot.exists()) {
            return partDocSnapshot.data().location;
        } else {
            console.error(`Part with ID ${partId} does not exist`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting material location: ${error}`);
        throw error;
    }
}

export const confirmSubAssembly = async (assemblyId, subAssemblyId, progressId, currentUser) => {
    try {
        const progressDocRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/progress`, progressId);
        await updateDoc(progressDocRef, {
            confirmed: true,
            last_modified_by: currentUser,
            last_modified: serverTimestamp(),
        });
    } catch (error) {
        console.error(`Error updating progress confirmation: ${error}`);
        throw error;
    }
}