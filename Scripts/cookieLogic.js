//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>

import {firebase} from './firebaseInitialization.js'

import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

//<--------------------------------------------------------- COOKIE LOGIC ---------------------------------------------------------------------------------------->

function checkConsentStatus() {

    //test reset
    //localStorage.clear();

    const consentStatus = localStorage.getItem('consent');
    const cookieContainer = document.getElementById("cookieContainer");

    //console.log(consentStatus);

    if (consentStatus === "accepted") {

        getAnalytics(firebase);
        cookieContainer.style.display = "none";

    } else if (consentStatus === "denied") {

        cookieContainer.style.display = "none";

    } else if (consentStatus === null) {

        cookieContainer.style.display = "block";

    }
}

document.getElementById("consentCookieAcceptButton").onclick = function () {
    cookieAccept();
}
document.getElementById("consentCookieAcceptButtonPrivacyTab").onclick = function () {
    cookieAccept();
    document.getElementById("privacyPolicyContainer").style.display = "none";
}

function cookieAccept() {
    localStorage.setItem('consent', 'accepted');
    document.getElementById("cookieContainer").style.display = "none";
    getAnalytics(firebase);
}

document.getElementById("consentCookieDenyButton").onclick = function () {
    cookieDeny();
}
document.getElementById("consentCookieDenyButtonPrivacyTab").onclick = function () {
    cookieDeny();
    document.getElementById("privacyPolicyContainer").style.display = "none";
}

function cookieDeny() {
    localStorage.setItem('consent', 'denied');
    document.getElementById("cookieContainer").style.display = "none";
}

document.getElementById("cookiePreferenceButton").onclick = function () {
    showPrivacyPolicy();
}

function showPrivacyPolicy() {
    document.getElementById("privacyPolicyContainer").style.display = "block";
    document.getElementById("cookieContainer").style.display = "none";
}

document.getElementById("cookieSettingsButton").onclick = function () {
    showPrivacyPolicy();
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {checkConsentStatus}
