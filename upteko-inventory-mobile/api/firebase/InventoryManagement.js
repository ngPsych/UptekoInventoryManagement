import { getFirestore, doc, getDoc, updateDoc, serverTimestamp, collection, onSnapshot, deleteDoc, setDoc, query, collectionGroup, getDocs } from "firebase/firestore";
import app from "./FirebaseConfig";

const db = getFirestore(app);

export const subscribeToAllParts = (callback) => {
    const partsCollection = collection(db, "parts");

    return onSnapshot(partsCollection, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            sku: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity,
            location: doc.data().location,
            description: doc.data().description,
            lastModified: doc.data().last_modified,
            supplier: doc.data().supplier,
            supplierItemNumber: doc.data().supplier_item_number,
            minPoint: doc.data().min_point
        }));
        callback(items);
    }, (error) => {
        console.error("Error fetching items: ", error);
        throw error;
    });
};

export const subscribeToPart = (sku, callback) => {
    const partRef = doc(db, "parts", sku);

    return onSnapshot(partRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const partData = {
                id: docSnapshot.id,
                ...docSnapshot.data()
            };
            callback(partData);
        }
    }, (error) => {
        console.error("Error subscribing to part:", error);
        throw error;
    });
};

export const getPartBySKU = async ({ sku }) => {
    try {
        const partRef = doc(db, "parts", sku);
        const docSnap = await getDoc(partRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching part:", error);
        throw error;
    }
};

export const updateItemQuantity = async ({ sku, quantity }) => {
    try {
        const itemRef = doc(db, 'parts', sku);
        
        await updateDoc(itemRef, {
            quantity: quantity,
            last_modified: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating item quantity:", error);
        throw error;
    }
}

export const addNewPart = async (id, name, quantity, location, description, supplier, supplierItemNumber, minPoint) => {
    try {
        await setDoc(doc(db, "parts", id), {
            name: name,
            quantity: quantity,
            location: location,
            description: description,
            supplier: supplier,
            supplier_item_number: supplierItemNumber,
            min_point: minPoint,
            date_created: serverTimestamp(),
            last_modified: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding new part to inventory:", error);
        throw error;
    }
}

export const deletePartBySKU = async (sku) => {
    try {
        const partRef = doc(db, "parts", sku);
        const docSnap = await getDoc(partRef);
        
        if (docSnap.exists()) {
            await deleteDoc(partRef);
            return true;
        }
    } catch (error) {
        console.error("Error deleting part document:", error);
        throw error;
    }
};

export const subscribeToAllSubAssemblies = (callback) => {
    const subassemblyGroupQuery = query(collectionGroup(db, "subassembly"));

    const unsubscribe = onSnapshot(subassemblyGroupQuery, async (snapshot) => { 
        const promises = [];
        const subassemblies = [];

        snapshot.forEach(async (doc) => {
            const subassemblyPath = `${doc.ref.path}/finished`;
            const subcollectionRef = collection(db, subassemblyPath);
            
            const promise = getDocs(subcollectionRef).then(querySnapshot => {
                const quantity = querySnapshot.size;
                const data = doc.data();
                if (data) {
                    subassemblies.push({
                        sku: doc.id,
                        assembly: data.assembly,
                        name: data.name,
                        quantity: quantity,
                        minPoint: data.min_point,
                        location: data.location,
                        imageURL: data.imageURL,
                        lastModified: data.last_modified,
                        dateCreated: data.date_created
                    });
                }
            });
            promises.push(promise);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        // Once all promises have resolved and subassemblies are populated, invoke the callback
        callback(subassemblies);
    }, (error) => {
        console.error("[inventoryManagement] Error subscribing to Sub-Assemblies:", error);
        throw error;
    });
    return unsubscribe;
};

export const subscribeToSubAssembly = (assemblyId, subAssemblyId, id, callback) => {
    const subAssemblyRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/finished`, id);

    return onSnapshot(subAssemblyRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const subAssemblyData = {
                id: docSnapshot.id,
                ...docSnapshot.data()
            };
            callback(subAssemblyData);
        }
    }, (error) => {
        console.error("Error subscribing to sub-assembly:", error);
        throw error;
    });
};