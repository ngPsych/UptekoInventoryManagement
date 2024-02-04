import app from "./firebaseConfig"
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export const addUserData = async (email: string, firstName: string, lastName: string) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const usersCollection = collection(db, "users");
        const userDocsSnapshot = await getDocs(usersCollection);
        const users = userDocsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return users; // This will be an array of user objects
    } catch (error) {
        console.error("Error fetching users: ", error);
        throw error;
    }
};