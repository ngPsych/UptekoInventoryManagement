import app from "./firebaseConfig"
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export const generateUniquePartID = async (): Promise<string> => {
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

export const generateUniqueMaterialListID = async (assemblyID: string, subAssemblyID: string): Promise<string> => {
    try {
        const ongoingCollectionRef = collection(db, `assembly/${assemblyID}/subassembly/${subAssemblyID}/ongoing`);
        const finishedCollectionRef = collection(db, `assembly/${assemblyID}/subassembly/${subAssemblyID}/finished`);

        const ongoingDocsSnapshot = await getDocs(ongoingCollectionRef);
        const finishedDocsSnapshot = await getDocs(finishedCollectionRef);

        const ongoingIDs = ongoingDocsSnapshot.docs.map(doc => doc.id);
        const finishedIDs = finishedDocsSnapshot.docs.map(doc => doc.id);

        // Find the highest number in ongoing and finished IDs
        let highestOngoingNumber = 0;
        let highestFinishedNumber = 0;

        if (ongoingIDs.length > 0) {
            highestOngoingNumber = findHighestIDNumber(ongoingIDs, 2);
        }

        if (finishedIDs.length > 0) {
            highestFinishedNumber = findHighestIDNumber(finishedIDs, 2);
        }

        // If both ongoing and finished are empty, create an ID with XX001
        if (ongoingIDs.length === 0 && finishedIDs.length === 0) {
            return `${assemblyID.charAt(0)}${subAssemblyID.charAt(0)}001`;
        }

        const highestNumber = Math.max(highestOngoingNumber, highestFinishedNumber);

        // const newID = `${assemblyID.charAt(0)}${subAssemblyID.charAt(0)}${(highestNumber + 1).toString().padStart(3, '0')}`;
        const newID = `${assemblyID.charAt(0)}${subAssemblyID.charAt(0)}${(highestNumber + 1).toString().padStart(Math.max(3, String(highestNumber + 1).length), '0')}`;

        return newID;
    } catch (error) {
        console.error("Error generating unique Material List ID:", error);
        throw error;
    }
};


// Function to find the highest number in the existing IDs
const findHighestIDNumber = (existingIDs: string[], skipCharacters: number = 0): number => {
    let highestNumber = 0;
    existingIDs.forEach(id => {
        const number = parseInt(id.slice(skipCharacters), 10); // Slice the specified number of characters and convert to number
        if (number > highestNumber) {
            highestNumber = number;
        }
    });
    return highestNumber;
};