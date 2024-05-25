import app from "./FirebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export const generateUniquePartID = async () => {
    try {
        const partsCollectionRef = collection(db, "parts");
        const partsDocsSnapshot = await getDocs(partsCollectionRef);

        // Extract IDs from documents
        const partDocumentIds = partsDocsSnapshot.docs.map(doc => doc.id);

        // If parts collection is empty, return the first ID "P0001"
        if (partDocumentIds.length === 0) {
            return "P0001";
        }

        const highestIDNumber = findHighestIDNumber(partDocumentIds, 1);
        const newID = `P${(highestIDNumber + 1).toString().padStart(Math.max(4, String(highestIDNumber + 1).length), '0')}`;

        return newID;
    } catch (error) {
        console.error("Error generating unique Part ID:", error);
        throw error;
    }
};

const findHighestIDNumber = (existingIDs, skipCharacters = 0) => {
    let highestNumber = 0;
    existingIDs.forEach(id => {
        const number = parseInt(id.slice(skipCharacters), 10); // Slice the specified number of characters and convert to number
        if (number > highestNumber) {
            highestNumber = number;
        }
    });
    return highestNumber;
};