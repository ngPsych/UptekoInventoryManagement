import app from "./firebaseConfig"
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Item } from "../../interfaces/IItem";
import { SubassemblyItem } from "../../interfaces/ISubassemblyItem";

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

export const getAllSubassemblyItems = async (): Promise<SubassemblyItem[]> => {
    try {
        const inventorySubassemblyCollection = collection(db, "inventory_subassembly");
        const inventorySubassemblyDocsSnapshot = await getDocs(inventorySubassemblyCollection);
        const inventorySubassembly = inventorySubassemblyDocsSnapshot.docs.map(doc => ({
            sku: doc.id,
            quantity: doc.data().quantity,
            last_modified: doc.data().last_modified
        }));
    
        const subassemblies: SubassemblyItem[] = [];
    
        for (const invSubassembly of inventorySubassembly) {
            const subassemblyDocRef = doc(db, "subassembly", invSubassembly.sku);
            const subassemblyDocSnap = await getDoc(subassemblyDocRef);
    
            if (subassemblyDocSnap.exists()) {
                const subassemblyData = subassemblyDocSnap.data() as any;
                const subassemblyItem: SubassemblyItem = {
                    sku: invSubassembly.sku,
                    name: subassemblyData.name,
                    quantity: invSubassembly.quantity,
                    location: subassemblyData.location,
                    description: subassemblyData.description,
                    lastModified: invSubassembly.last_modified,
                    minPoint: subassemblyData.min_point
                };
                subassemblies.push(subassemblyItem);
            }
        }

        return subassemblies;
    } catch (error) {
        console.error("Error fetching subassembly items: ", error);
        throw error;
    }
};

export const addNewMaterial = async (
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
            location: location,
            description: description,
            supplier: supplier,
            supplier_item_number: supplierItemNumber,
            min_point: minPoint,
            date_created: serverTimestamp()
        });

        // Adds a new document for "inventory_parts"
        await setDoc(doc(db, "inventory_parts", id), {
            last_modified: serverTimestamp(),
            quantity: quantity
        })
    
}