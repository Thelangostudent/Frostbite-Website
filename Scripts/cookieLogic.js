//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {firebase} from './firebaseInitialization.js'

import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

//<--------------------------------------------------------- COOKIE LOGIC ---------------------------------------------------------------------------------------->

/** The "checkConsentStatus" function is  */
function checkConsentStatus() {

    const consentStatus = localStorage.getItem('consent');
    const cookieContainer = document.getElementById("cookieContainer");

    if (consentStatus === "accepted") {

        getAnalytics(firebase);
        cookieContainer.style.display = "none";

    } else if (consentStatus === "denied") {

        cookieContainer.style.display = "none";

    } else if (consentStatus === null) {

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

function cookieAccept() {
    localStorage.setItem('consent', 'accepted');
    document.getElementById("cookieContainer").style.display = "none";
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

function cookieDeny() {
    localStorage.setItem('consent', 'denied');
    document.getElementById("cookieContainer").style.display = "none";
}

/** Code that fetches the cookiePreferenceButton button in the login panel and adds the relevant function to it */
document.getElementById("cookiePreferenceButton").onclick = function () {
    showPrivacyPolicy();
}

function showPrivacyPolicy() {
    document.getElementById("privacyPolicyContainer").style.display = "block";
    document.getElementById("cookieContainer").style.display = "none";
}

/** Code that fetches the cookieSettingsButton button in the login panel and adds the relevant function to it */
document.getElementById("cookieSettingsButton").onclick = function () {
    showPrivacyPolicy();
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {checkConsentStatus}
