import app from "./firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore(app);

export const getPartBySKU = async ({ sku }) => {
    try {
        const partRef = doc(db, "parts", sku); // "parts" is the name of your collection
        const docSnap = await getDoc(partRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching part:", error);
        throw error;
    }
};