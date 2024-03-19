import app from "./firebaseConfig"
import { getFirestore, collection, doc, setDoc, serverTimestamp, onSnapshot, getDocs, deleteDoc, query, where,
DocumentSnapshot, updateDoc } from "firebase/firestore";
import { AssemblyItem, Material, SubAssemblyItem } from "../../interfaces/IAssembly";

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

export const confirmSubAssemblyFinished = async (assemblyId: string, subAssemblyId: string) => {
    try {
        const finishedDocRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/finished`);
        await setDoc(finishedDocRef, {
            // Fields for 'finished' document
            date_created: serverTimestamp()
        });
    } catch (error) {
        console.error("[assemblyManagement] Error confirming the sub-assembly is finished:", error);
        throw error;
    }
}

export const saveSubAssemblyProgress = async (assemblyId: string, subAssemblyId: string,
    checkedMaterials: string[], user: string) => {

        try {
            const exist = await currentUserOngoingSubAssemblyExist(assemblyId, subAssemblyId, user)
            const ongoingCollectionRef = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/ongoing`);
            let ongoingSubAssemblyId;

            // checks if it already exist, if yes then update instead of create
            if (exist) {
                const q = query(ongoingCollectionRef, where("created_by", "==", user));
                const querySnapshot = await getDocs(q);

                const ongoingSubAssemblyIds: string[] = [];
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                        ongoingSubAssemblyIds.push(doc.id);
                    });

                    ongoingSubAssemblyId = ongoingSubAssemblyIds[0];
                    const ongoingDocRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/ongoing`, ongoingSubAssemblyId);

                    await updateDoc(ongoingDocRef, {
                        // assembly_id: assemblyId,
                        // subassembly_id: subAssemblyId,
                        checked_materials: checkedMaterials,
                        last_modified_by: user,
                        last_modified: serverTimestamp(),
                    });
                }

                
            } else {
                const querySnapshot = await getDocs(ongoingCollectionRef);

                if (querySnapshot.docs.length === 0) {
                    ongoingSubAssemblyId = `${assemblyId[0]}${subAssemblyId[0]}000001`;
                } else {
                    // Extract numeric parts of document IDs, find the maximum, and increment it
                    const numericSuffixes = querySnapshot.docs.map(doc => parseInt(doc.id.match(/\d+$/)?.[0] || "0"));
                    const maxSuffix = Math.max(...numericSuffixes);
                    const nextSuffix = (maxSuffix + 1).toString().padStart(6, '0');
                    ongoingSubAssemblyId = `${assemblyId[0]}${subAssemblyId[0]}${nextSuffix}`;
                }

                const ongoingDocRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/ongoing`, ongoingSubAssemblyId);
    
                // Create or update the document with the necessary fields
                await setDoc(ongoingDocRef, {
                    // assembly_id: assemblyId,
                    // subassembly_id: subAssemblyId,
                    checked_materials: checkedMaterials,
                    last_modified_by: user,
                    finished_by: "",
                    created_by: user,
                    last_modified: serverTimestamp(),
                    date_created: serverTimestamp()
                });
            }

            

    

        } catch (error) {
            console.error("[assemblyManagement] Error creating sub-assembly progress:", error);
            throw error;
        }
}

export const currentUserOngoingSubAssemblyExist = async (assemblyId: string, subAssemblyId: string, userFullName: string) => {
    try {
        // Reference to the ongoing collection
        const ongoingCollectionRef = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/ongoing`);

        // Create a query to find documents where fullName matches
        const q = query(ongoingCollectionRef, where("created_by", "==", userFullName));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // console.log("No documents with the provided fullName were found.");
            return false;
        } else {
            // console.log("Documents with the provided fullName exist.");
            return true;
        }
    } catch (error) {
        console.error("Error checking for fullName in ongoing collection:", error);
        throw error;
    }
}

export const getProgressCheckedMaterials = async (assemblyId: string, subAssemblyId: string, createdBy: string) => {
    try {
        const ongoingCollectionRef = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/ongoing`);

        // Query documents where the field "started_by" is equal to startedBy
        const q = query(ongoingCollectionRef, where("created_by", "==", createdBy));

        // Get the documents that match the query
        const querySnapshot = await getDocs(q);

        let checkedMaterials: any[] = [];

        // Loop through the documents
        querySnapshot.forEach((doc: DocumentSnapshot) => {
            // Retrieve the field "checked_materials" from each document
            const data = doc.data();
            if (data && data.checked_materials) {
                checkedMaterials = data.checked_materials;
            }
        });
        console.log(checkedMaterials)
        return checkedMaterials;
    } catch (error) {
        console.error("[assemblyManagement] Error retrieving checked materials:", error);
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

const deleteCollection = async (collectionPath: string) => {
    const collectionRef = collection(db, collectionPath)
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
    deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
};

export const deleteAssembly = async (assemblyId: string) => {
    try {
        const subassembliesCollectionPath = `assembly/${assemblyId}/subassembly`;
        const subassembliesSnapshot = await getDocs(collection(db, subassembliesCollectionPath));

        for (const subassembly of subassembliesSnapshot.docs) {
            const subassemblyId = subassembly.id;
            await deleteCollection(`${subassembliesCollectionPath}/${subassemblyId}/materials_needed`);
            await deleteCollection(`${subassembliesCollectionPath}/${subassemblyId}/finished`);
            await deleteCollection(`${subassembliesCollectionPath}/${subassemblyId}/ongoing`);
    
            // Delete the subassembly document
            await deleteDoc(subassembly.ref);
        }
    
        // Finally, delete the main assembly document
        const assemblyDocRef = doc(db, "assembly", assemblyId);
        await deleteDoc(assemblyDocRef);
    } catch (error) {
        console.log(`[assemblyManagement] Error deleting assembly ${assemblyId}:`, error);
        throw error;
    }
};

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