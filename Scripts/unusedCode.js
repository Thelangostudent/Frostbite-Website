//<------------------------------------------------------ ALL FB IMPORTS ------------------------------------------------------------------------------------------>

import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';
import {
    getStorage,
    ref as refStorage,
    uploadBytes,
    getDownloadURL,
    listAll,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';

//<--------------------------------------------------------------- TBA ------------------------------------------------------------------------------------------>

/*const email = "admin@outlook.com"
const password = "123Password123";

    function createUser() {
    console.log("User creation activated!");

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
            console.log("User created!")
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}*/

/*
        function checkIfLoggedIn(){
            console.log("Checking for users")

            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("Update: You are logged in!");
                } else {
                    console.log("Update: You are not logged in!");
                }
            });
        }
    */

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

//none