import app from "./firebaseConfig"
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, serverTimestamp, onSnapshot, DocumentSnapshot, updateDoc } from "firebase/firestore";
import { Item } from "../../interfaces/IItem";
import { SubassemblyItem } from "../../interfaces/ISubassemblyItem";

const db = getFirestore(app);

export const subscribeToInventoryParts = (callback: (items: Item[]) => void) => {
    const partsCollection = collection(db, "parts");

    return onSnapshot(partsCollection, (snapshot) => {
        const items: Item[] = snapshot.docs.map(doc => ({
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

export const subscribeToInventorySubassemblyItems = (callback: (items: SubassemblyItem[]) => void) => {
    const subassemblyCollection = collection(db, "subassembly");

    return onSnapshot(subassemblyCollection, (snapshot) => {
        const items: SubassemblyItem[] = snapshot.docs.map(doc => ({
            sku: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity,
            location: doc.data().location,
            description: doc.data().description,
            lastModified: doc.data().last_modified,
            minPoint: doc.data().min_point
        }));
        callback(items);
    }, (error) => {
        console.error("Error fetching subassembly items: ", error);
        throw error;
    });
};

export const addNewPart = async (
    id: string,
    name: string,
    quantity: number,
    location: string,
    description: string,
    supplier: string, 
    supplierItemNumber: string,
    minPoint: number) => {

        // Adds a new document for "parts"
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
};

export const updateItemQuantity = async (collection: string, sku: string, quantity: number, action: string) => {
    try {
        const itemRef = doc(db, collection, sku);

        // Get the current document
        const docSnap = await getDoc(itemRef);

        if (docSnap.exists()) {
            // Get current quantity
            const currentQuantity = docSnap.data().quantity || 0;

            // Calculate new quantity (use add to add and remove to subtract)
            let newQuantity = action === "add" ? currentQuantity + quantity : currentQuantity - quantity;

            // Ensure the quantity doesn't go negative
            newQuantity = Math.max(newQuantity, 0);

            await updateDoc(itemRef, {
                quantity: newQuantity,
                last_modified: serverTimestamp(),
            });
        } else {
            console.error(`[inventoryManagement] No item found with SKU: ${sku}`);
            throw new Error(`No item found with SKU: ${sku}`);
        }
    } catch (error) {
        console.error("[inventoryManagement] Error updating item quantity:", error);
        throw error;
    }
}
