//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>

import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {getDatabase} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {
    getStorage,
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';

//<----------------------------------------------------- DATABASE CONFIGURATION ------------------------------------------------------------------------------------->

// Firebase connection details such as apiKey and authDomain
const firebaseConfig = {
    apiKey: "AIzaSyDdmHsJu_s8rE1dkcB3oLyyTLJQOI1ZVAg",
    authDomain: "frostbite-backend.firebaseapp.com",
    projectId: "frostbite-backend",
    storageBucket: "frostbite-backend.appspot.com",
    messagingSenderId: "388567472682",
    appId: "1:388567472682:web:893bbf2a74fe78bc4e8153",
    measurementId: "G-CMP5CEZ81E",
    databaseURL: "https://frostbite-backend-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initializes the Firebase configuration
const firebase = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();

// gets the pop up window and text (animated to drop down for 3 seconds) and creates globally exported constraints of said elements, this is basically the "feedback" window
const popUpInfoWindow = document.getElementById("popUpInfo");
const popUpWindowText = document.getElementById("popUpInfoText");

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {firebase, db, storage, popUpInfoWindow, popUpWindowText}
