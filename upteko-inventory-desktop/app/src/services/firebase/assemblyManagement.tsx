import app from "./firebaseConfig"
import { getFirestore, collection, doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { AssemblyItem } from "../../interfaces/IAssemblyItem";

const db = getFirestore(app);

export const testCreateNewAssembly = async (imageURL: string, id: string, subAsssemblyDocIDs: string[], materialsNeededDocIDs: string[], materialsQuantities: number[], materialsNames: string[]) => {
    try {
        const assemblyDocRef = doc(db, "assembly", id);
        await setDoc(assemblyDocRef, {
            quantity: 0,
            imageURL: imageURL,
        });

        for (const subassemblyDocID of subAsssemblyDocIDs) {
            const subassemblyDocRef = doc(db, `assembly/${id}/subassembly`, subassemblyDocID);

            await setDoc(subassemblyDocRef, {
                imageURL: "https://firebasestorage.googleapis.com/v0/b/uptekoinventory.appspot.com/o/images%2FAlba?alt=media&token=a806efdb-c916-4642-add0-957b405f8d2a",
                name: subassemblyDocID,
                dateCreated: serverTimestamp(),
                lastModified: serverTimestamp(),
                quantity: 0,
                location: "",
                description: ""
            });

            for (let i = 0; i < materialsNeededDocIDs.length; i++) {
                const materialsNeededDocRef = doc(db, `assembly/${id}/subassembly/${subassemblyDocID}/materialsNeeded`, materialsNeededDocIDs[i]);
                await setDoc(materialsNeededDocRef, {
                    quantity: materialsQuantities[i],
                    name: materialsNames[i],
                });
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

export const subscribeToSubassemblyItems = (id: string, callback: (items: AssemblyItem[]) => void) => {
    const subassemblyColleciton = collection(db, `assembly/${id}/subassembly`)

    return onSnapshot(subassemblyColleciton, (snapshot) => {
        const subassemblyItems : AssemblyItem[] = snapshot.docs.map(doc => ({
            imageURL: doc.data().imageURL,
            id: doc.id,
        }));
        callback(subassemblyItems);
    }, (error) => {
        console.error('Error getting subassembly items: ', error);
        throw error;
    })
};