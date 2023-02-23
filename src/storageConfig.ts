// Firestore configuration details
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firestoreConfig = {
    apiKey: "AIzaSyBx2g70UgEyQOJ2b_NUPT1E6Shyzo2BsOk",
    authDomain: "media-hub-766a3.firebaseapp.com",
    projectId: "media-hub-766a3",
    storageBucket: "media-hub-766a3.appspot.com",
    messagingSenderId: "788098512897",
    appId: "1:788098512897:web:8a6742f1a300b464be2800",
};

// Initialize Firebase
const app = initializeApp(firestoreConfig);

// Initialize Realtime Database and get a reference to the service
export default getStorage(app);

