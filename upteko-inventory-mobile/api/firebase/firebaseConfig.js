import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBxnpmiVFSmb1ZIHvY3tMnF7p-TXxQlWZ4",
    authDomain: "uptekoinventory.firebaseapp.com",
    projectId: "uptekoinventory",
    storageBucket: "uptekoinventory.appspot.com",
    messagingSenderId: "814951795471",
    appId: "1:814951795471:web:f20d4b4877435bfbdfcc7a",
    measurementId: "G-H8XFJMQN95"
};


const app = initializeApp(firebaseConfig);

export default app;
