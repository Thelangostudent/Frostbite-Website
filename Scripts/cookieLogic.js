//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {firebase} from './firebaseInitialization.js'

import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

//<--------------------------------------------------------- COOKIE LOGIC ---------------------------------------------------------------------------------------->

/** The "checkConsentStatus" function is a function that checks whether or not a user has accepted the privacy policy.
 *  If a user has accepted the policy, the website will initialize google analytics and start collecting data about the user such as device, browser, location and time spent on the page
 *  If a user has declined the policy, no data collection will ever be made
 *  If a user has not yet made a choice, a cookie notification window is displayed at the bottom of the page
 *
 *  The consent status is saved in the localStorage, so the user will not have to face the cookie notification window again if the window is refreshed
 *  The user, however, can update the cookie policy choice at any time by clicking on the "cookie settings" button in the footer and updating the answer*/
function checkConsentStatus() {

    //gets the consent status from localStorage
    const consentStatus = localStorage.getItem('consent');
    const cookieContainer = document.getElementById("cookieContainer");

    if (consentStatus === "accepted") {
        //if the consent status is "accepted", the cookie window at startup will be forever hidden to the user and data collection will be initialized whenever the user visits the page

        //initializes data collection
        getAnalytics(firebase);

        //hides the cookie window that is shown on startup
        cookieContainer.style.display = "none";

    } else if (consentStatus === "denied") {
        //if the consent status is "denied", the cookie container will then be forever hidden to the user and no data collection will ever be initialized

        //hides the cookie window that is shown on startup
        cookieContainer.style.display = "none";

    } else if (consentStatus === null) {
        //if the consent status is "null" in the localStorage, the user has not yet made a choice, and the cookie window is displayed at startup

        //shows the cookie window
        cookieContainer.style.display = "block";
    }
}

/** Code that fetches the consentCookieAcceptButton button in the login panel and adds the relevant function to it */
document.getElementById("consentCookieAcceptButton").onclick = function () {
    cookieAccept();
}

/** Code that fetches the consentCookieAcceptButtonPrivacyTab button in the login panel and adds the relevant function to it */
document.getElementById("consentCookieAcceptButtonPrivacyTab").onclick = function () {
    cookieAccept();
    document.getElementById("privacyPolicyContainer").style.display = "none";
}

/** The "cookieAccept" function is used whenever the user clicks on the "accept" button in the cookie policy window, the user choice is then stored in the localStorage
 until said storage is cleared by the user to avoid displaying the cookie window at startup if the user has previously already made a choice regarding the data collection.
 After saving the status in the localStorage and hiding the fixed cookie window, the function then initializes the data collection in firebase using the getAnalytics firebase call*/
function cookieAccept() {

    //saves the user choice in the localStorage
    localStorage.setItem('consent', 'accepted');

    //hides the fixed cookie container that is shown on startup to new visitors
    document.getElementById("cookieContainer").style.display = "none";

    //sends a green light to firebase that allows the site and server to start collecting information
    getAnalytics(firebase);
}

/** Code that fetches the consentCookieDenyButton button in the login panel and adds the relevant function to it */
document.getElementById("consentCookieDenyButton").onclick = function () {
    cookieDeny();
}

/** Code that fetches the consentCookieDenyButtonPrivacyTab button in the login panel and adds the relevant function to it */
document.getElementById("consentCookieDenyButtonPrivacyTab").onclick = function () {
    cookieDeny();
    document.getElementById("privacyPolicyContainer").style.display = "none";
}

/** The "cookieDeny" function is used whenever the user clicks on the "deny" button in the cookie policy window, the user choice is then stored in the localStorage
 until said storage is cleared by the user to avoid displaying the cookie window at startup if the user has previously already made a choice regarding the data collection.
 No data collection by the website will ever be initialized if the user selects the "deny" option */
function cookieDeny() {

    //saves the user choice in the localStorage
    localStorage.setItem('consent', 'denied');

    //hides the fixed cookie container that is shown on startup to new visitors
    document.getElementById("cookieContainer").style.display = "none";
}

/** Code that fetches the cookiePreferenceButton button in the login panel and adds the relevant function to it */
document.getElementById("cookiePreferenceButton").onclick = function () {
    showPrivacyPolicy();
}

/** The "showPrivacyPolicy" function displays a window featuring the privacy policy to the page, this function is called whenever a user wants to update the cookie
 choice and clicks on the "cookie settings" button of the bottom of the page, or the "read more" option in the fixed cookie window */
function showPrivacyPolicy() {
    //hides the cookie popup and shows the privacy window
    document.getElementById("privacyPolicyContainer").style.display = "block";
    document.getElementById("cookieContainer").style.display = "none";

    //gets the localstorage value made by the user
    const consentStatus = localStorage.getItem('consent');

    //creates a relevant feedback variable of the current choice
    let consentFeedback = "not set"
    if (consentStatus === "accepted") {
        consentFeedback = "accept all";
    } else if (consentStatus === "denied") {
        consentFeedback = "reject all";
    }

    //adds the current choice at the end of the privacy window
    const currentText = " We use cookies, web beacons and other similar technologies from Google for measurement services and marketing purposes. We collect information such as what browser/device you use, your location, and the total amount of time you have spent on our website. The information is collected through Google Analytics. You can opt out of this at any time by clicking on the \"Reject all\" button found below.";
    document.getElementById("currentCookieSettings").innerHTML = currentText + " Your current choice is: '" + consentFeedback + "'";
}

/** Code that fetches the cookieSettingsButton button in the login panel and adds the relevant function to it */
document.getElementById("cookieSettingsButton").onclick = function () {
    showPrivacyPolicy();
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {checkConsentStatus}
