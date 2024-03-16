import app from "./firebaseConfig"
import { getFirestore, collection, doc, setDoc, serverTimestamp, onSnapshot, getDocs } from "firebase/firestore";
import { AssemblyItem, SubAssemblyItem } from "../../interfaces/IAssembly";

const db = getFirestore(app);

export const testCreateNewAssembly = async (imageURL: string, id: string, subAsssemblyDocIDs: string[], selectedMaterials: { [key: number]: { sku: string; name: string, quantity: number}[] }) => {
    try {
        const assemblyDocRef = doc(db, "assembly", id);
        await setDoc(assemblyDocRef, {
            quantity: 0,
            imageURL: imageURL,
        });

        for (const subassemblyDocID of subAsssemblyDocIDs) {
            const subassemblyDocRef = doc(db, `assembly/${id}/subassembly`, subassemblyDocID);
        
            await setDoc(subassemblyDocRef, {
                assembly: id,
                name: subassemblyDocID,
                imageURL: "https://firebasestorage.googleapis.com/v0/b/uptekoinventory.appspot.com/o/images%2FAlba?alt=media&token=a806efdb-c916-4642-add0-957b405f8d2a",
                quantity: 0,
                min_point: 0,
                location: "",
                last_modified: serverTimestamp(),
                date_created: serverTimestamp(),
            });

            const subassemblyIndex = subAsssemblyDocIDs.indexOf(subassemblyDocID); // Finding the index of subassemblyDocID
            if (subassemblyIndex !== -1) { // Check if the subassemblyDocID exists in the array
                for (let i = 0; i < selectedMaterials[0].length; i++) {
                    const materialsNeededDocRef = doc(db, `assembly/${id}/subassembly/${subassemblyDocID}/materials_needed`, selectedMaterials[0][i].sku);
                    await setDoc(materialsNeededDocRef, {
                        quantity: selectedMaterials[0][i].quantity,
                        name: selectedMaterials[0][i].name,
                    });
                }
            }
        }
        

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createNewAssembly = async (imageURL: string, id: string, suDocIDs: string[]) => {
    try {
        const assemblyDocRef = doc(db, "assembly", id);
        await setDoc(assemblyDocRef, {
            quantity: 0,
            imageURL: imageURL,
        });

        for (const subDocID of suDocIDs) {
            const subDocRef = doc(db, `assembly/${id}/subassembly`, subDocID);

            await setDoc(subDocRef, {
                imageURL: "https://firebasestorage.googleapis.com/v0/b/uptekoinventory.appspot.com/o/images%2FAlba?alt=media&token=a806efdb-c916-4642-add0-957b405f8d2a",
                name: subDocID,
                dateCreated: serverTimestamp(),
                lastModified: serverTimestamp(),
                quantity: 0,
                location: "",
                description: ""
            });
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const subscribeToAssemblyItems = (callback: (items: AssemblyItem[]) => void) => {
    const assemblyCollection = collection(db, "assembly");

    return onSnapshot(assemblyCollection, (snapshot) => {
        const assemblyItems: AssemblyItem[] = snapshot.docs.map(doc => ({
            imageURL: doc.data().imageURL,
            id: doc.id,
        }));
        callback(assemblyItems);
    }, (error) => {
        console.error('Error getting assembly items: ', error);
        throw error;
    })
};

export const subscribeToSubassemblyItems = (id: string, callback: (items: SubAssemblyItem[]) => void) => {
    const subassemblyColleciton = collection(db, `assembly/${id}/subassembly`)

    return onSnapshot(subassemblyColleciton, (snapshot) => {
        const subassemblyItems : SubAssemblyItem[] = snapshot.docs.map(doc => ({
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
        callback(subassemblyItems);
    }, (error) => {
        console.error('Error getting subassembly items: ', error);
        throw error;
    })
};

export const getMaterialsNeeded = async (assemblyId: string, subAssemblyId: string) => {
    try {
        const materialsNeededCollection = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/materials_needed`)
        const materialsNeededDocsSnapshot = await getDocs(materialsNeededCollection);
        const materials = materialsNeededDocsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return materials;
    } catch (error) {
        console.error(`Error fetching materials needed for [assemblyID: ${assemblyId}] [sub-assemblyID: ${subAssemblyId}]:`, error);
        throw error;
    }
}