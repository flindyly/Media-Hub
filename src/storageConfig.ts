// Firestore configuration details
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firestoreConfig = {
    apiKey: "AIzaSyDXY4sA0RYOYt-vzGCUS7eNfM2cS2tSb_s",
    authDomain: "media-hub-proto.firebaseapp.com",
    projectId: "media-hub-proto",
    storageBucket: "media-hub-proto.appspot.com",
    messagingSenderId: "663821474061",
    appId: "1:663821474061:web:7b402138d5c5deec2ab844"
};


// Initialize Firebase
const app = initializeApp(firestoreConfig);

// Initialize Realtime Database and get a reference to the service
export default getStorage(app);

