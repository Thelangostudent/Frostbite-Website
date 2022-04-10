//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {enablePopUpWindow} from "./adminFunctions.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';

//<--------------------------------------------------------- LOGIN/LOGOUT ---------------------------------------------------------------------------------------->

document.getElementById("acceptSignInButton").onclick = function () {
    getEmailAndPassword();
}

function getEmailAndPassword() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        enablePopUpWindow("The fields cannot be empty!");

    } else {
        logIn(email, password);
    }
}

function logIn(email, password) {

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            enablePopUpWindow("Successfully logged in");

            document.getElementById("adminContainer").style.display = "block";
            document.getElementById("adminLogin").style.display = "none";
            document.getElementById("popUpLogin").style.display = "none";

            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
        })
        .catch(() => {
            enablePopUpWindow("Wrong email/password!");
            document.getElementById("adminContainer").style.display = "none";
        });
}

document.getElementById("logOutButton").onclick = function () {
    logOut();
}

function logOut() {

    const auth = getAuth();
    signOut(auth).then(() => {
        enablePopUpWindow("Successfully logged out");
        document.getElementById("adminLogin").style.display = "block";
    }).catch(() => {
        enablePopUpWindow("Unable to log out");
    });
}

document.getElementById("cancelSignInButton").onclick = function () {
    cancelSignIn();
}

function cancelSignIn() {
    document.getElementById("popUpLogin").style.display = "none";
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
}

document.getElementById("adminLogin").onclick = function () {
    showSignInWindow();
}

function showSignInWindow() {
    document.getElementById("popUpLogin").style.display = "block";
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

//none
