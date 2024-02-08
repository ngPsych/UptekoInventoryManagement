import app from "./firebaseConfig"
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { Item } from "../../interfaces/IItem";

const db = getFirestore(app);

export const getAllParts = async () => {
    try {
        const partsCollection = collection(db, "parts");
        const partDocsSnapshot = await getDocs(partsCollection);
        const parts = partDocsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log("parts", parts);
        return parts; // This will be an array of user objects
    } catch (error) {
        console.error("Error fetching parts: ", error);
        throw error;
    }
};

export const getAllInventoryParts = async () => {
    try {
        const inventoryPartsCollection = collection(db, "inventory_parts");
        const inventoryPartDocsSnapshot = await getDocs(inventoryPartsCollection);
        const inventoryParts = inventoryPartDocsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log("inventoryparts", inventoryParts);
        return inventoryParts; // This will be an array of user objects
    } catch (error) {
        console.error("Error fetching inventory parts: ", error);
        throw error;
    }
};

export const getAllItems = async (): Promise<Item[]> => {
    try {
        const inventoryPartsCollection = collection(db, "inventory_parts");
        const inventoryPartDocsSnapshot = await getDocs(inventoryPartsCollection);
        const inventoryParts = inventoryPartDocsSnapshot.docs.map(doc => ({
            sku: doc.id,
            quantity: doc.data().quantity,
            last_modified: doc.data().last_modified
        }));

        const items: Item[] = [];
        
        for (const inventoryPart of inventoryParts) {
            const partDocRef = doc(db, "parts", inventoryPart.sku);
            const partDocSnap = await getDoc(partDocRef);

            if (partDocSnap.exists()) {
                const partData = partDocSnap.data() as any; // Casting to any if no specific interface is available
                const item: Item = {
                    sku: inventoryPart.sku,
                    name: partData.name,
                    quantity: inventoryPart.quantity,
                    location: partData.location,
                    description: partData.description,
                    lastModified: inventoryPart.last_modified, // Assuming date_created is the last modified timestamp
                    supplier: partData.supplier,
                    supplierItemNumber: partData.supplier_item_number,
                    minPoint: partData.min_point
                };
                items.push(item);
            }
        }
        
        return items;
    } catch (error) {
        console.error("Error fetching items: ", error);
        throw error;
    }
};