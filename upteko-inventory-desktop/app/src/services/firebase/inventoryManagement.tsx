import app from "./firebaseConfig"
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Item } from "../../interfaces/IItem";
import { SubassemblyItem } from "../../interfaces/ISubassemblyItem";

const db = getFirestore(app);

export const getAllParts = async (): Promise<Item[]> => {
    try {
        const partsCollection = collection(db, "parts");
        const partsDocsSnapshot = await getDocs(partsCollection);
        const parts = partsDocsSnapshot.docs.map(doc => ({
            sku: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity,
            location: doc.data().location,
            description: doc.data().description,
            last_modified: doc.data().last_modified,
            supplier: doc.data().supplier,
            supplier_item_number: doc.data().supplier_item_number,
            min_point: doc.data().min_point
        }));

        const items: Item[] = [];
        
        for (const part of parts) {
            const item: Item = {
                sku: part.sku,
                name: part.name,
                quantity: part.quantity,
                location: part.location,
                description: part.description,
                lastModified: part.last_modified,
                supplier: part.supplier,
                supplierItemNumber: part.supplier_item_number,
                minPoint: part.min_point
            };
            items.push(item);
        }
        
        return items;
    } catch (error) {
        console.error("Error fetching items: ", error);
        throw error;
    }
};

export const getAllSubassemblyItems = async (): Promise<SubassemblyItem[]> => {
    try {
        const subassemblyCollection = collection(db, "subassembly");
        const subassemblyDocsSnapshot = await getDocs(subassemblyCollection);
        const subassemblies = subassemblyDocsSnapshot.docs.map(doc => ({
            sku: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity,
            location: doc.data().location,
            description: doc.data().description,
            last_modified: doc.data().last_modified,
            min_point: doc.data().min_point
        }));
    
        const subassemblyItems: SubassemblyItem[] = [];
    
        for (const subassembly of subassemblies) {
            const subassemblyItem: SubassemblyItem = {
                sku: subassembly.sku,
                name: subassembly.name,
                quantity: subassembly.quantity,
                location: subassembly.location,
                description: subassembly.description,
                lastModified: subassembly.last_modified,
                minPoint: subassembly.min_point
            };
            subassemblyItems.push(subassemblyItem);
        }

        return subassemblyItems;
    } catch (error) {
        console.error("Error fetching subassembly items: ", error);
        throw error;
    }
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

}