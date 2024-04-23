import { getFirestore, doc, getDoc, updateDoc, serverTimestamp, collection, onSnapshot, deleteDoc, setDoc } from "firebase/firestore";
import app from "./firebaseConfig";

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
        const partRef = doc(db, "parts", sku); // "parts" is the name of your collection
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

export const updateItemQuantity = async ({ collectionName, sku, quantity }) => {
    try {
        const itemRef = doc(db, collectionName, sku);
        
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
            console.log(`${sku} Part document deleted successfully`);
            return true;
        }
    } catch (error) {
        console.error("Error deleting part document:", error);
        throw error;
    }
};