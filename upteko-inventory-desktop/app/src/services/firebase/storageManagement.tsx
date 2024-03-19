import app from "./firebaseConfig"
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";

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

// Image name will be the same as the name of the assembly, subassembly etc.
export const deleteImage = async (imageName: string) => {
    try {
        const storageRef = ref(storage, `images/${imageName}`);
        // Check if the image exists by trying to get its download URL
        try {
            await getDownloadURL(storageRef);
            // If successful, delete the image
            await deleteObject(storageRef);
        } catch (downloadUrlError) {
            // If error occurs, it means the image does not exist, so do nothing
            console.log(`[storageManagement] Image does not exist or could not retrieve URL: ${imageName}`);
        }
    } catch (error) {
        console.error("[storageManagement] Error during image deletion process:", error);
        throw error;
    }
}