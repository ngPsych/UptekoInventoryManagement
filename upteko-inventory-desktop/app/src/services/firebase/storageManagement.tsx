import app from "./firebaseConfig"
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);

export const getFileDownloadURL = async (filePath: string) => {
    try {
        const fileRef = ref(storage, filePath);
        const downloadURL = await getDownloadURL(fileRef);
        console.log("Download URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error getting download URL: ", error);
        throw error;
    }
};