// JavaScript source code


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDdmHsJu_s8rE1dkcB3oLyyTLJQOI1ZVAg",
    authDomain: "frostbite-backend.firebaseapp.com",
    projectId: "frostbite-backend",
    storageBucket: "frostbite-backend.appspot.com",
    messagingSenderId: "388567472682",
    appId: "1:388567472682:web:893bbf2a74fe78bc4e8153",
    measurementId: "G-CMP5CEZ81E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);