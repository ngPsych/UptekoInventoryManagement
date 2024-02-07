import app from "./firebaseConfig"
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const db = getFirestore(app);

export const addUserData = async (email: string, firstName: string, lastName: string) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        
        // console.log("Document written with ID: ", docRef.id);
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

export const getCurrentUserInfo = async (email: string) => {
    try {
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", email));
        const userDocsSnapshot = await getDocs(userQuery);

        if (userDocsSnapshot.empty) {
            throw new Error("User document not found in Firestore.");
        }

        // Assuming there's only one user with a given email
        const userData = userDocsSnapshot.docs[0].data();

        return userData;
    } catch (error) {
        console.error("Error fetching current user info: ", error);
        throw error;
    }
};