import app from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
    updatePassword, User, sendPasswordResetEmail, signOut } from "firebase/auth";

const auth = getAuth(app)

// Function to sign up a new user
export const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            return true;
        })
        .catch(error => {
            console.log("Error signing up user:", error);
            return false;
        });
};

// Function to sign in an existing user
export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;

            return user; // Possibly send "logged in successfully" or similar
        })
        .catch(error => {
            throw error;
        })
}

// Function to get user information if their state is set as "signed in"
export const getSignIn = () => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            // const uid = user.uid;
            // and other info then return
        } else {
            // user is signed out
        }
    })
}

// Function to get current user
export const getCurrentUser = () => {
    if (auth.currentUser !== null) {
        return auth.currentUser
    }
}

// Function to update password for a logged-in user
export const updateUserPassword = async (user: User, newPassword: string) => {
    return updatePassword(user, newPassword)
        .then(() => {
            // update successful
        })
        .catch(error => {
            throw error;
        });
}

// Function for when forgetting password
export const sendUserPasswordResetEmail = async (email: string) => {
    return sendPasswordResetEmail(auth, email)
    .then(() => {
        // success
    })
    .catch(error => {
        throw error;
    })
}

// Function to sign out
export const signOutUser = () => {
    return signOut(auth)
        .then(() => {
            // sign out success
        })
        .catch(error => {
            // error occured
        })
}

// Currently not implemented
export const deleteUserByEmail = async () => {
    return (
        null
    );
}