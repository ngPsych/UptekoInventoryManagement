import app from "./firebaseConfig"
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const storage = getStorage(app);

export const getFileDownloadURL = async (filePath: string) => {
    try {
        const fileRef = ref(storage, filePath);
        const downloadURL = await getDownloadURL(fileRef);
        return downloadURL;
    } catch (error) {
        console.error("Error getting download URL: ", error);
        throw error;
    }
};

export const uploadFile = async (file: File, filePath: string) => {
    try {
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        console.log("File uploaded successfully.");

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file: ", error);
        throw error;
    }
};