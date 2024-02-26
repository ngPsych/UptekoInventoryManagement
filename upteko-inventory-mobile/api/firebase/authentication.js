import app from "./firebaseConfig";
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export const signIn = ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error Code:', errorCode);
        console.log('Error Message:', errorMessage);
        throw error; // You may want to rethrow the error to handle it in the calling code
    });
}

export const getCurrentUser = () => {
    if (auth.currentUser !== null) {
        return auth.currentUser
    }
}

export const signOutUser = () => {
    return signOut(auth)
        .then(() => {
            // sign out success
        })
        .catch(error => {
            // error occured
        })
}