//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {enablePopUpWindow} from "./adminFunctions.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';

//<--------------------------------------------------------- LOGIN/LOGOUT ---------------------------------------------------------------------------------------->

/** Code that fetches the acceptSignInButton button in the login panel and adds the relevant function to it */
document.getElementById("acceptSignInButton").onclick = function () {
    getEmailAndPassword();
}

/** The "getEmailAndPassword" function gets the user inputs from the login window, checks if the input is empty or not, and then initializes
 a login attempt based on the given inputs in a new final login function */
function getEmailAndPassword() {

    //defines the user input
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    //checks if the user input is empty or not
    if (email === "" || password === "") {
        //displays a relevant error message if any of the input fields are empty
        enablePopUpWindow("The fields cannot be empty!");

    } else {
        //starts a login attempt if the input contains text
        logIn(email, password);
    }
}

/** The "logIn" function takes the user input from the parameter values that gets defined in the "getEmailAndPassword" function, then checks if the information
 provided in the parameters matches the email and password connected to an account in firebase, there is only one account, and that is the admin account, so the admin
 menu is displayed if the login is successful. Only the admin account is authorized in firebase to make changes to the database */
function logIn(email, password) {

    //gets a reference to the authorization in firebase
    const auth = getAuth();

    //attempts to sign into the backend firebase server with the given email and password,
    //these inputs are hashed internally in firebase using a wide variety of different algorithms while attempting to authorize a user,
    //security is one of our top priorities
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            //displays a relevant logged in message in the reusable feedback window
            enablePopUpWindow("Successfully logged in");

            //displays the admin menu to the user if the authorization was successful
            document.getElementById("adminContainer").style.display = "block";
            document.getElementById("adminLogin").style.display = "none";
            document.getElementById("popUpLogin").style.display = "none";

            //resets the login fields
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
        })
        .catch(() => {
            //displays a relevant feedback message if the user provides the wrong email address or password
            enablePopUpWindow("Wrong email/password!");
            document.getElementById("adminContainer").style.display = "none";
        });
}

/** Code that fetches the logOutButton button in the admin menu and adds the relevant function to it */
document.getElementById("logOutButton").onclick = function () {
    logOut();
}

/** The "logOut" function logs the admin out of the admin account and hides the admin menu if the "logOut" button in the admin menu is pressed */
function logOut() {

    //gets an authorization reference
    const auth = getAuth();

    //sends a signOut request to the backend
    signOut(auth).then(() => {
        //displays a relevant feedback message if the admin successfully logs out, as well as hiding the admin menu
        enablePopUpWindow("Successfully logged out");
        document.getElementById("adminLogin").style.display = "block";
    }).catch(() => {
        //displays a relevant feedback message to the admin if an internal firebase error occurs while logging out
        enablePopUpWindow("Unable to log out");
    });
}

/** Code that fetches the cancelSignInButton button in the login panel and adds the relevant function to it */
document.getElementById("cancelSignInButton").onclick = function () {
    cancelSignIn();
}

/** The "cancelSignIn" function closes the sign in window and resets the input fields */
function cancelSignIn() {
    //hides the sign in window
    document.getElementById("popUpLogin").style.display = "none";

    //resets the input fields in the sign in window
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
}

/** Code that fetches the adminLogin button in the footer and adds the relevant function to it */
document.getElementById("adminLogin").onclick = function () {
    showSignInWindow();
}

/** The "showSignInWindow" function displays the sign in window to the user by using the display: block CSS feature */
function showSignInWindow() {
    document.getElementById("popUpLogin").style.display = "block";
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

//none
