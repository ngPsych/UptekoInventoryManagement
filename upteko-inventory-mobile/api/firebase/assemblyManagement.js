import app from "./firebaseConfig";
import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore(app);

export const confirmSubAssembly = async (assemblyId, subAssemblyId, progressId, currentUser) => {
    try {
        const progressDocRef = doc(db, `assembly/${assemblyId}/subassembly/${subAssemblyId}/progress`, progressId);
        await updateDoc(progressDocRef, {
            confirmed: true,
            last_modified_by: currentUser,
            last_modified: serverTimestamp(),
        });
    } catch (error) {
        console.error(`Error updating progress confirmation: ${error}`);
        throw error;
    }
}