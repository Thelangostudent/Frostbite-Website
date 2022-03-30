//<----------------------------------------------------- PARALLAX EFFECT --------------------------------------------------------------------------------------------->

document.getElementById("body").onscroll = function para() {
    if (isMobile === false) {
        const scrolltotop = document.scrollingElement.scrollTop;
        const target = document.getElementById("backgroundPara");
        const xvalue = "center";
        const factor = 0.5;
        const windowWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const yvalue = (windowWidth * 0.040) + (scrolltotop * factor);
        target.style.backgroundPosition = xvalue + " " + yvalue + "px";
    }
}

window.onresize = function fixImage() {
    if (isMobile === false) {
        const doc = document.documentElement;
        const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        window.scroll(left + 1, top + 1);
    }
}

//<----------------------------------------------------- DATABASE CONFIGURATION ------------------------------------------------------------------------------------->

import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
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

// Initialize Firebase configuration
const firebase = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();

const popUpInfoWindow = document.getElementById("popUpInfo");
const popUpWindowText = document.getElementById("popUpInfoText");

//<--------------------------------------------------------- ONLOAD FUNCTIONS ---------------------------------------------------------------------------------------->

document.body.onload = function () {
    getInfoFromServer()
};

function getInfoFromServer() {
    getBannerImage();
    getOutlineColour();
    getBannerTextStatus();
    getTitleText();
    getUserStatus();
    getYouTubeVideoURL();
    getAlbums();
    getBackgroundColour();
    getBackgroundColourForImages();
    checkIfMobile();
    getTextColour();
    checkConsentStatus();
}

let isMobile = false;
function checkIfMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        isMobile = true;
    }
}

//gets the current logo from firebase WIP
function getLogo() {

}

function getBannerImage() {
    getDownloadURL(refStorage(storage, 'bannerImage'))
        .then((url) => {
            const backgroundPara = document.getElementById('backgroundPara');
            backgroundPara.style.backgroundImage = "url('" + url + "')";
        })
}

let array = [];
//gets album and single covers from firebase
function getAlbums() {

    array = [];

    const gridToReset = document.getElementById("gridContainer");
    gridToReset.innerHTML = '';

    const listRef = refStorage(storage, 'AlbumCovers');

    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                array[array.length] = itemRef;
            });
        }).then(() => {
        createAlbumElements(array);
    }).catch((error) => {
        enablePopUpWindow("Unable to fetch covers");
    });
}


async function createAlbumElements(array){

    let sortedArray = [];

    for (const element of array) {
        const nameToFile = element.name.toString();
        const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");
        const dateToConvert = albumURL_Decoded.substring(0, 19);

        let musicLink = albumURL_Decoded.substring(19);
        let dateToSet = dateToConvert.toDate("dd/mm/yyyy hh:ii:ss");
        let imageUrl = await getDownloadURL(element);

        sortedArray.push({musicLink: musicLink, date: dateToSet, image: imageUrl})
    }

    sortedArray.sort(function(a,b) {
        return a.date - b.date;
    });

    for (const element of sortedArray) {
        const divElement = document.createElement("div");
        const addAlbum = document.createElement("img");

        addAlbum.src = element.image;
        addAlbum.className = "albumImage";

        addAlbum.onclick = function() { openInNewTab(element.musicLink) }
        divElement.appendChild(addAlbum);

        divElement.className = "coverGridItem";

        //reverts the order
        //document.getElementById("gridContainer").appendChild(divElement);
        document.getElementById("gridContainer").insertBefore(divElement, document.getElementById("gridContainer").firstChild);
    }
}

function openInNewTab(link){
    window.open(link);
}

String.prototype.toDate = function(format)
{
    const normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
    const normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    const formatItems     = normalizedFormat.split('-');
    const dateItems       = normalized.split('-');

    const monthIndex  = formatItems.indexOf("mm");
    const dayIndex    = formatItems.indexOf("dd");
    const yearIndex   = formatItems.indexOf("yyyy");
    const hourIndex     = formatItems.indexOf("hh");
    const minutesIndex  = formatItems.indexOf("ii");
    const secondsIndex  = formatItems.indexOf("ss");

    const today = new Date();

    const year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
    const month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
    const day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

    const hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
    const minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
    const second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

    return new Date(year,month,day,hour,minute,second);
};

function getBannerTextStatus() {
    const bannerTextStatus = ref(db, 'toggleBannerStatus/status');
    onValue(bannerTextStatus, (snapshot) => {

        let toggleStatus = snapshot.val();
        let bannerText = document.getElementById("bannerText");
        let aboutTitle = document.getElementById("aboutTitle");
        let toggleButton = document.getElementById("toggleBannerText");

        if (toggleStatus === "ON") {
            bannerText.style.display = "block";
            aboutTitle.style.marginTop = "-1.5vw"
            toggleButton.innerHTML = "Overlay: ON"
        } else {
            bannerText.style.display = "none";
            aboutTitle.style.marginTop = "4.27vw"
            toggleButton.innerHTML = "Overlay: OFF"
        }
    });
}

//Gets the frostbite text from the server on load
function getTitleText() {
    const userStatus = ref(db, 'titleText/titleTextContent');
    onValue(userStatus, (snapshot) => {
        document.getElementById("aboutText").innerHTML = snapshot.val();
    });
}

function getYouTubeVideoURL() {
    const userStatus = ref(db, 'youtubeURL/youtubeURLContent');
    onValue(userStatus, (snapshot) => {
        document.getElementById("youtubePreviewVideo").src = "https://www.youtube.com/embed/" + snapshot.val();
    });
}

//gets the user status (logged in/logged out) and displays the admin menu accordingly
function getUserStatus() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {

            if (user.email === "admin@outlook.com") {
                document.getElementById("adminContainer").style.display = "block";
                document.getElementById("adminLogin").style.display = "none";
            }

        } else {
            document.getElementById("adminContainer").style.display = "none";
        }
    });
}

function getOutlineColour() {
    const newOutlineColour = ref(db, 'outlineColour/HexCode');
    onValue(newOutlineColour, (snapshot) => {
        const bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.style.setProperty('--outlineColor', snapshot.val());

        let frostbiteLogo = "./Pictures/frostbiteLogo.png";

        const r = hex_to_RGB(snapshot.val()).r
        const g = hex_to_RGB(snapshot.val()).g;
        const b = hex_to_RGB(snapshot.val()).b;

        updateBackgroundColour(frostbiteLogo, r, g, b, "logo");

    });
}

function getBackgroundColour() {
    const newBackgroundColour = ref(db, 'backgroundColour/HexCode');
    onValue(newBackgroundColour, (snapshot) => {
        const bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.style.setProperty('--backgroundColour', snapshot.val());
    });
}

function getTextColour() {
    const newTextColour = ref(db, 'textColour/HexCode');
    onValue(newTextColour, (snapshot) => {
        const bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.style.setProperty('--textColour', snapshot.val());
    });
}

function getBackgroundColourForImages() {

    let youtubeImage = "./Pictures/YoutubeInverted.png";
    let instagramImage = "./Pictures/InstagramInverted.png";
    let facebookImage = "./Pictures/FacebookInverted.png";

    let youtubeSocials = "./Pictures/socialsYoutubeImage.png";
    let spotifySocials = "./Pictures/socialsSpotifyImage.png";

    const newBackgroundColour = ref(db, 'backgroundColour/HexCode');
    onValue(newBackgroundColour, (snapshot) => {

        const r = hex_to_RGB(snapshot.val()).r
        const g = hex_to_RGB(snapshot.val()).g;
        const b = hex_to_RGB(snapshot.val()).b;

        updateBackgroundColour(youtubeImage, r, g, b, "youtubeLogo");
        updateBackgroundColour(instagramImage, r, g, b, "instagramLogo");
        updateBackgroundColour(facebookImage, r, g, b, "facebookLogo");

        updateBackgroundColour(youtubeSocials, r, g, b, "socialsYoutube");
        updateBackgroundColour(spotifySocials, r, g, b, "socialsSpotify");
    });
}

function updateBackgroundColour(imgSrc, R, G, B, canvasElement) {

    const canvas = document.getElementById(canvasElement);
    const ctx = canvas.getContext('2d');

    let img = new Image();
    img.src = imgSrc;

    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = R;
            data[i + 1] = G;
            data[i + 2] = B;
        }
        ctx.putImageData(imageData, 0, 0);

        if (canvasElement === "logo"){
            document.getElementById("favicon").href = canvas.toDataURL("image/x-icon");
        }
    }
}

function hex_to_RGB(hex) {
    const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
}

//gets images from FB storage. WIP.
function getLiveGalleryImages(){




}

//<--------------------------------------------------------- ADMIN FUNCTIONS ---------------------------------------------------------------------------------------->

document.getElementById("changeBackgroundColour").onclick = function () {
    changeBackgroundColour();
}

function changeBackgroundColour(){
    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #141414)")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChangeBackground();
    }
}

/**
 * Uploads the new logo to firebase (replaces the existing one)
 * WIP (currently a stub).
 * */
function uploadNewLogo() {

}

function confirmColourChangeBackground(){
    let newOutlineColour = document.getElementById("newValueContainerValue").value;

    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    const isValidHex = reg.test(newOutlineColour);

    if (isValidHex === true) {
        if (newOutlineColour === "") {
            enablePopUpWindow("Field cannot be empty!");
        } else {
            set(ref(db, 'backgroundColour'), {
                HexCode: newOutlineColour,
            });
            enablePopUpWindow("Colour updated!");
            closeNewValueContainerWindow();
            resetNewAdminValue();
        }
    } else {
        enablePopUpWindow("Not a valid HEX colour!");
    }
}

document.getElementById("changeOutlineColour").onclick = function () {
    changeOutlineColour();
}

function changeOutlineColour() {

    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #a14a95)")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChange();
    }
}

function confirmColourChange() {
    let newOutlineColour = document.getElementById("newValueContainerValue").value;

    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    const isValidHex = reg.test(newOutlineColour);

    if (isValidHex === true) {
        if (newOutlineColour === "") {
            enablePopUpWindow("Field cannot be empty!");
        } else {
            set(ref(db, 'outlineColour'), {
                HexCode: newOutlineColour,
            });
            enablePopUpWindow("Colour updated!");
            closeNewValueContainerWindow();
            resetNewAdminValue();
        }
    } else {
        enablePopUpWindow("Not a valid HEX colour!");
    }
}

document.getElementById("changeTextColour").onclick = function () {
    changeTextColour();
}

function changeTextColour() {

    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #ffffff)")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChangeOnText();
    }
}

function confirmColourChangeOnText() {
    let newTextColour = document.getElementById("newValueContainerValue").value;

    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    const isValidHex = reg.test(newTextColour);

    if (isValidHex === true) {
        if (newTextColour === "") {
            enablePopUpWindow("Field cannot be empty!");
        } else {
            set(ref(db, 'textColour'), {
                HexCode: newTextColour,
            });
            enablePopUpWindow("Colour updated!");
            closeNewValueContainerWindow();
            resetNewAdminValue();
        }
    } else {
        enablePopUpWindow("Not a valid HEX colour!");
    }
}

document.getElementById("changeBackgroundImage").onclick = function (e) {
    changeBackgroundImage();
}

function changeBackgroundImage() {

    let files = [];
    let reader;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/png, image/jpg, image/jpeg, image/gif";

    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function () {

            const storage = getStorage();
            const imagesRef = refStorage(storage, 'bannerImage');

            //uploads the new image to firebase
            uploadBytes(imagesRef, files[0]).then((snapshot) => {

                //gets the new image from firebase and updates the banner
                getDownloadURL(refStorage(storage, 'bannerImage'))
                    .then((url) => {
                        const backgroundPara = document.getElementById('backgroundPara');
                        backgroundPara.style.backgroundImage = "url('" + url + "')";
                        enablePopUpWindow("Banner updated!");
                    })
            });
        }
        reader.readAsDataURL((files[0]));
    }
    input.click();
}

document.getElementById("toggleBannerText").onclick = function () {
    toggleBannerTitle();
}

function toggleBannerTitle() {
    let status = document.getElementById("toggleBannerText").innerHTML;

    if (status === "Overlay: ON") {
        set(ref(db, 'toggleBannerStatus'), {
            status: "OFF",
        });
        document.getElementById("toggleBannerText").innerHTML = "Overlay: OFF"

    } else {
        set(ref(db, 'toggleBannerStatus'), {
            status: "ON",
        });
        document.getElementById("toggleBannerText").innerHTML = "Overlay: ON"
    }

}

document.getElementById("changeText").onclick = function () {
    changeText();
}

function changeText() {

    showPopUpAdminValueWindow("Please copy & paste your new story text here")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmChangeText();
    }

}

function confirmChangeText() {
    let newText = document.getElementById("newValueContainerValue").value;
    if (newText === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else {
        set(ref(db, 'titleText'), {
            titleTextContent: newText,
        });
        enablePopUpWindow("Story updated!");
        closeNewValueContainerWindow();
        resetNewAdminValue();
    }
}

// uploads an album to firebase
document.getElementById("addAlbumCover").onclick = function () {

    showPopUpAdminValueWindow("Enter the full spotify URL to the single/album you want to add:")

    document.getElementById("acceptNewValueButton").onclick = function () {
        uploadNewAlbumImage();
    }
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function uploadNewAlbumImage() {
    let newAlbumURL = document.getElementById("newValueContainerValue").value;
    let isValid = isValidHttpUrl(newAlbumURL);

    if (newAlbumURL === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else if (isValid === false){
        enablePopUpWindow("URL is invalid!");
    } else {

        let alreadyAdded = "false";
        for (const element of array) {
            const nameToFile = element.name.toString();
            const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");
            const albumURL_Decoded_timeRemoved = albumURL_Decoded.substring(19);

            if (newAlbumURL === albumURL_Decoded_timeRemoved) {
                enablePopUpWindow("Single/Album already added!");
                alreadyAdded = "true";
            }
        }

        if (alreadyAdded === "false") {
            let files = [];
            let reader;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = "image/png, image/jpg, image/jpeg, image/gif";

            input.onchange = e => {
                files = e.target.files;
                reader = new FileReader();
                reader.onload = function () {

                    const newDate = new Date();
                    const datetime = newDate.today() + " " + newDate.timeNow();
                    //fake a date below to test
                    //const datetime = "03/06/2022:13:33:30";

                    const albumPathToEncode = datetime + newAlbumURL;
                    const albumURL_Encoded = albumPathToEncode.replace(/\//g, "Ø");

                    const storage = getStorage();
                    const imagesRef = refStorage(storage, 'AlbumCovers/' + albumURL_Encoded);

                    uploadBytes(imagesRef, files[0]).then((snapshot) => {
                        getAlbums();
                        closeNewValueContainerWindow();
                        resetNewAdminValue();

                        enablePopUpWindow("Single/Album added!");
                    });
                }
                reader.readAsDataURL((files[0]));
            }
            input.click();
        }
    }
}

document.getElementById("deleteAlbumCover").onclick = function () {
    deleteAlbum();
}

function deleteAlbum(){
    showPopUpAdminValueWindow("Enter the full URL to the single/album you want to delete:")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmDeleteAlbum();
    }
}

async function confirmDeleteAlbum(){
    let albumToDelete = document.getElementById("newValueContainerValue").value;
    if (albumToDelete === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else {
        for (const element of array) {
            const nameToFile = element.name.toString();
            const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");
            const albumURL_Decoded_timeRemoved = albumURL_Decoded.substring(19);

            if (albumToDelete === albumURL_Decoded_timeRemoved) {

                const albumRef = refStorage(storage, 'AlbumCovers/' + element.name);

                deleteObject(albumRef).then(() => {
                    enablePopUpWindow("Single/Album deleted!");
                    getAlbums();
                }).catch((error) => {
                    enablePopUpWindow("Unable to delete single/album");
                });

                closeNewValueContainerWindow();
                resetNewAdminValue();

            } else {
                enablePopUpWindow("Unable to find single/album");
            }
        }
    }
}

document.getElementById("changeYouTubeURL").onclick = function () {
    changeYouTubeURL();
}

function changeYouTubeURL() {

    showPopUpAdminValueWindow("Enter the new YouTube URL-ID (the letters after 'watch?v=')")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmYouTubeURL();
    }

}

function confirmYouTubeURL() {
    let newURL = document.getElementById("newValueContainerValue").value;
    if (newURL === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else {
        set(ref(db, 'youtubeURL'), {
            youtubeURLContent: newURL,
        });
        closeNewValueContainerWindow();
        resetNewAdminValue();

        enablePopUpWindow("Video updated!");
    }
}

//uploads live image to FireBase. WIP
function uploadLiveImage(){


}

function enablePopUpWindow(text) {
    popUpWindowText.innerHTML = text;

    document.body.removeChild(popUpInfoWindow);
    document.body.appendChild(popUpInfoWindow);
    popUpInfoWindow.style.animation = "dropDown 3.25s"
}

function showPopUpAdminValueWindow(descriptionOfFeature) {
    let newValueContainer = document.getElementById("popUpAdminValue");
    newValueContainer.style.display = "block";

    let popUpAdminValueText = document.getElementById("popUpAdminValueText");
    popUpAdminValueText.innerHTML = descriptionOfFeature;
}

document.getElementById("cancelNewValueButton").onclick = function () {
    closeNewValueContainerWindow();
}

function closeNewValueContainerWindow() {
    document.getElementById("popUpAdminValue").style.display = "none";
    resetNewAdminValue();
}

function resetNewAdminValue() {
    document.getElementById("newValueContainerValue").value = "";
}

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
        .then((userInfo) => {
            enablePopUpWindow("Successfully logged in");

            document.getElementById("adminContainer").style.display = "block";
            document.getElementById("adminLogin").style.display = "none";
            document.getElementById("popUpLogin").style.display = "none";

            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
        })
        .catch((error) => {
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
    }).catch((error) => {
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

//<--------------------------------------------------------- COOKIE CONSENT ------------------------------------------------------------------------------------->

function checkConsentStatus(){

    //test reset
    //localStorage.clear();

    const consentStatus = localStorage.getItem('consent');
    const cookieContainer = document.getElementById("cookieContainer");

    //console.log(consentStatus);

    if (consentStatus === "accepted"){

        getAnalytics(firebase);
        cookieContainer.style.display = "none";

    } else if (consentStatus === "denied") {

        cookieContainer.style.display = "none";

    } else if (consentStatus === null){

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

function cookieAccept(){
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

function cookieDeny(){
    localStorage.setItem('consent', 'denied');
    document.getElementById("cookieContainer").style.display = "none";
}

document.getElementById("cookiePreferenceButton").onclick = function () {
    showPrivacyPolicy();
}

function showPrivacyPolicy(){
    document.getElementById("privacyPolicyContainer").style.display = "block";
    document.getElementById("cookieContainer").style.display = "none";
}

document.getElementById("cookieSettingsButton").onclick = function () {
    showPrivacyPolicy();
}

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