import app from "./firebaseConfig";
import { getFirestore, doc, setDoc, getDocs, deleteDoc, serverTimestamp, collection } from "firebase/firestore";

const db = getFirestore(app);

export const confirmSubAssembly = async (assemblyId, subAssemblyId, user, confirmingUser) => {
    try {
        const progress = await getProgress(assemblyId, subAssemblyId, user);

        for (const data of progress) {
            const checkedMaterials = data.checked_materials || [];
            const usedMaterials = data.used_materials || [];
            console.log("Used Materials:", usedMaterials);
            console.log("Checked Materials:", checkedMaterials);

            if (usedMaterials.every(material => checkedMaterials.includes(material))) {
                console.log("Subassembly is finished, everything checked out");

                // Functionality to create /finished
                const finishedDocRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/finished`, data.id);
                await setDoc(finishedDocRef, {
                    checked_materials: data.checked_materials,
                    created_by: data.created_by,
                    date_created: data.date_created,
                    finished_by: confirmingUser,
                    last_modified: serverTimestamp(),
                    last_modified_by: confirmingUser,
                    used_materials: data.used_materials,
                });

                deleteProgress(assemblyId, subAssemblyId, user);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error(`[assemblyManagement] Error confirming subassembly: ${error}`);
        throw error;
    }
};

export const getProgress = async (assemblyId, subAssemblyId, user) => {
    try {
        const progressCollectionRef = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/progress`);
        const querySnapshot = await getDocs(progressCollectionRef);

        const progressData = []; // Array to store document data

        querySnapshot.forEach(doc => {
            const docId = doc.id;

            if (docId.startsWith(assemblyId.charAt(0)) && docId.charAt(1) === subAssemblyId.charAt(0)) {
                const data = doc.data();
                data.id = docId;
                progressData.push(data);
            }
        });

        return progressData;
    } catch (error) {
        console.error(`Error getting progress: ${error}`);
        throw error;
    }
}


export const deleteProgress = async (assemblyId, subAssemblyId, currentUser) => {
    try {
        const progressCollectionRef = collection(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/progress`);
        const querySnapshot = await getDocs(progressCollectionRef);

        querySnapshot.forEach(async doc => {
            const docId = doc.id;
            // Check if the first two characters of the document ID match assemblyId and subAssemblyId
            if (docId.startsWith(assemblyId.charAt(0)) && docId.charAt(1) === subAssemblyId.charAt(0)) {
                const data = doc.data();
                if (data.created_by === currentUser) {
                    await deleteDoc(doc.ref);
                    console.log(`Progress deleted successfully for assembly ${assemblyId} and subassembly ${subAssemblyId}`);
                }
            }
        });
    } catch (error) {
        console.error(`[assemblyManagement] Error deleting progress on subassembly ${subAssemblyId}: ${error}`);
        throw error;
    }
}