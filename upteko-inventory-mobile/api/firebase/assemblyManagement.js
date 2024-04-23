import app from "./firebaseConfig";
import { getFirestore, doc, updateDoc, serverTimestamp, collection, onSnapshot } from "firebase/firestore";

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
    })
};

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