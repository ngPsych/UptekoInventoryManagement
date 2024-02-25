import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import app from "./firebaseConfig";

const db = getFirestore(app);

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