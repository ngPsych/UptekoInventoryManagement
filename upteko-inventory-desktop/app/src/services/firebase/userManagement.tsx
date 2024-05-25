import app from "./firebaseConfig"
import { getFirestore, collection, addDoc, getDocs, query, where,
    onSnapshot, QuerySnapshot, DocumentData, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore(app);

export const addUserData = async (email: string, firstName: string, lastName: string, role: string) => {
    try {
        await addDoc(collection(db, "users"), {
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: role,
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const subscribeToAllUsers = (callback: (users: any[]) => void) => {
    try {
        const usersCollection = collection(db, "users");
        const unsubscribe = onSnapshot(usersCollection, (querySnapshot: QuerySnapshot<DocumentData>) => {
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(users);
        });
        
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to users: ", error);
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

export const deleteUser = async (email: string) => {
    try {
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", email));
        const userDocsSnapshot = await getDocs(userQuery);

        if (userDocsSnapshot.empty) {
            throw new Error("User document not found in Firestore.");
        }

        const userDocId = userDocsSnapshot.docs[0].id;

        await deleteDoc(doc(db, "users", userDocId));
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};