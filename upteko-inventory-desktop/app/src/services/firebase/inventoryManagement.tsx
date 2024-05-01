import app from "./firebaseConfig"
import { getFirestore, collection, doc, getDoc, setDoc, serverTimestamp, onSnapshot, updateDoc, query, collectionGroup, QueryDocumentSnapshot, getDocs } from "firebase/firestore";
import { Item } from "../../interfaces/IItem";
import { SubAssemblyItem } from "../../interfaces/IAssembly";

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

export const subscribeToAllSubAssemblies = (callback: (items: SubAssemblyItem[]) => void): () => void => {
    const subassemblyGroupQuery = query(collectionGroup(db, "subassembly"));

    const unsubscribe = onSnapshot(subassemblyGroupQuery, async (snapshot) => {
        const promises: Promise<void>[] = [];
        const subassemblies: SubAssemblyItem[] = [];

        snapshot.forEach(async (doc: QueryDocumentSnapshot) => {
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

        await Promise.all(promises);

        callback(subassemblies);
    }, (error) => {
        console.error("[inventoryManagement] Error subscribing to Sub-Assemblies:", error);
        throw error;
    });

    return unsubscribe;
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

        const docSnap = await getDoc(itemRef);

        if (docSnap.exists()) {
            const currentQuantity = docSnap.data().quantity || 0;

            let newQuantity = action === "add" ? currentQuantity + quantity : currentQuantity - quantity;

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
};