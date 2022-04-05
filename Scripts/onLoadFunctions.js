//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>

import {db, storage} from './firebaseInitialization.js'
import {enablePopUpWindow} from "./adminFunctions.js";
import {checkConsentStatus} from "./cookieLogic.js";

import {onValue, ref} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getAuth, onAuthStateChanged,} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';
import {
    getDownloadURL,
    listAll,
    ref as refStorage,
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';

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
    getLiveGalleryImages();
    getBackgroundColour();
    getBackgroundColourForImages();
    checkIfMobile();
    getTextColour();
    checkConsentStatus();
    getTicketButtonLink();
}

let isMobile = false;

function checkIfMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
    }
}

function getBannerImage() {
    getDownloadURL(refStorage(storage, 'bannerImage'))
        .then((url) => {
            const backgroundPara = document.getElementById('backgroundPara');
            backgroundPara.style.backgroundImage = "url('" + url + "')";
        })
}

//gets album and single covers from firebase
let albumArray = [];

function getAlbums() {

    albumArray = [];

    const gridToReset = document.getElementById("gridContainer");
    gridToReset.innerHTML = '';

    const listRef = refStorage(storage, 'AlbumCovers');

    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                albumArray[albumArray.length] = itemRef;
            });
        }).then(() => {
        createAlbumElements(albumArray).then(() => "done");
    }).catch(() => {
        enablePopUpWindow("Unable to fetch covers");
    });
}

async function createAlbumElements(albumArray) {

    let sortedArray = [];

    for (const element of albumArray) {
        const nameToFile = element.name.toString();
        const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");
        const dateToConvert = albumURL_Decoded.substring(0, 19);

        let musicLink = albumURL_Decoded.substring(19);
        let dateToSet = dateToConvert.toDate("dd/mm/yyyy hh:ii:ss");
        let imageUrl = await getDownloadURL(element);

        sortedArray.push({musicLink: musicLink, date: dateToSet, image: imageUrl})
    }

    sortedArray.sort(function (a, b) {
        return a.date - b.date;
    });

    for (const element of sortedArray) {
        const divElement = document.createElement("div");
        const addAlbum = document.createElement("img");

        addAlbum.src = element.image;
        addAlbum.className = "albumImage";

        addAlbum.onclick = function () {
            openInNewTab(element.musicLink)
        }
        divElement.appendChild(addAlbum);

        divElement.className = "coverGridItem";

        //reverts the order
        //document.getElementById("gridContainer").appendChild(divElement);
        document.getElementById("gridContainer").insertBefore(divElement, document.getElementById("gridContainer").firstChild);
    }
}

let galleryArray = [];

//gets images from FB storage
function getLiveGalleryImages() {
    galleryArray = [];

    const galleryToReset = document.getElementById("galleryImages");
    const dotsToReset = document.getElementById("dots");
    galleryToReset.innerHTML = '';
    dotsToReset.innerHTML = '';

    const listRef = refStorage(storage, 'LiveGallery');

    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                galleryArray[galleryArray.length] = itemRef;
            });
        }).then(() => {
        clearTimeout(timeout);
        createGalleryElements(galleryArray).then(() => "done");
    }).catch(() => {
        enablePopUpWindow("Unable to fetch images");
    });
}

let slideIndex = 0;
async function createGalleryElements(galleryArray) {

    let sortedGalleryPaths = [];

    for (const element of galleryArray) {

        const nameToFile = element.name.toString();
        const galleryImageURL_Decoded = nameToFile.replace(/Ø/g, "/");
        const dateToConvert = galleryImageURL_Decoded.substring(0, 19);

        let dateToSet = dateToConvert.toDate("dd/mm/yyyy hh:ii:ss");
        let imageUrl = await getDownloadURL(element);

        sortedGalleryPaths.push({image: imageUrl, date: dateToSet})
    }

    sortedGalleryPaths.sort(function (a, b) {
        return a.date - b.date;
    });

    for (const element of sortedGalleryPaths) {

        const galleryElement = document.createElement("div");
        const image = document.createElement("img");

        image.src = element.image;
        image.className = "galleryImage";

        galleryElement.appendChild(image);

        galleryElement.className = "imageSlide fade";

        //reverts the order
        //document.getElementById("galleryImages").appendChild(galleryElement);
        document.getElementById("galleryImages").insertBefore(galleryElement, document.getElementById("galleryImages").firstChild);

        const dot = document.createElement("span");
        dot.className = "dot";
        dot.onclick = function(){changeCurrentSlide(sortedGalleryPaths.indexOf(element))};
        dot.style.cursor = "pointer";
        document.getElementById("dots").appendChild(dot);

    }

    showSlides();
}

let timeout = null;
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("imageSlide");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    timeout = setTimeout(showSlides, 3750); // Change image every 3.75 seconds
}

function changeCurrentSlide(slideToFocus) {
    clearTimeout(timeout);
    slideIndex = slideToFocus;
    showSlides();
}

function openInNewTab(link) {
    window.open(link);
}

String.prototype.toDate = function (format) {
    const normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
    const normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    const formatItems = normalizedFormat.split('-');
    const dateItems = normalized.split('-');

    const monthIndex = formatItems.indexOf("mm");
    const dayIndex = formatItems.indexOf("dd");
    const yearIndex = formatItems.indexOf("yyyy");
    const hourIndex = formatItems.indexOf("hh");
    const minutesIndex = formatItems.indexOf("ii");
    const secondsIndex = formatItems.indexOf("ss");

    const today = new Date();

    const year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
    const month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
    const day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();

    const hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
    const minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
    const second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

    return new Date(year, month, day, hour, minute, second);
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

// array of ticketbuttons, is to be sourced from FB. See getTicketButtonLinks.
let ticketButtonArray = [];

/**
 * Gets all the ticket buttons from FB.
 * The info stored on FB regarding the tickets is:
 * Relevant text (date, place and other info).
 * The Hyperlink that sends you to the ticket sales site.
 * */
function getTicketButtonLinks() {
    ticketButtonArray = [];
    const buttonText = "placeHolder";
    const buttonLink = "placeHolder.com";

    const buttonRef =   ref(db,'ticketButtons');

    /***
    onValue(buttonRef,(snapshot) =>{
        ticketButtonArray = snapshot.

    })
   ***/


}

/**
 * Backup method to getTicketButtonLinks in case
 * implemementing multiple buttons takes too long
 * */
function getTicketButtonLink() {



    const buttonHyperLinkRef =   ref(db,'ticketButtons/ticketButton/hyperlink');
    const buttonDescriptionRef = ref(db,'ticketButtons/ticketButton/description');


    onValue(buttonHyperLinkRef, (snapshot) => {
        document.getElementById("ticketButton").setAttribute("formaction",snapshot.val()) ;
    });


    onValue(buttonDescriptionRef, (snapshot) => {

        document.getElementById("ticketButton").innerHTML = snapshot.val();
        }
    );

    if (document.getElementById("ticketButton").innerHTML == "Invisible") {

        document.getElementById("ticketButton").hidden = true;

    }



}

function getTicketButtonLink2() {



    const buttonHyperLinkRef =   ref(db,'ticketButtons/ticketButton/hyperlink');
    const buttonDescriptionRef = ref(db,'ticketButtons/ticketButton/description');


    onValue(buttonHyperLinkRef, (snapshot) => {
        document.getElementById("ticketButton2").setAttribute("formaction",snapshot.val()) ;
    });


    onValue(buttonDescriptionRef, (snapshot) => {

            document.getElementById("ticketButton2").innerHTML = snapshot.val();
        }
    );

    if (document.getElementById("ticketButton2").innerHTML == "Invisible") {

        document.getElementById("ticketButton2").hidden = true;

    }

}


function getTicketButtonLink3() {



    const buttonHyperLinkRef =   ref(db,'ticketButtons/ticketButton/hyperlink');
    const buttonDescriptionRef = ref(db,'ticketButtons/ticketButton/description');


    onValue(buttonHyperLinkRef, (snapshot) => {
        document.getElementById("ticketButton3").setAttribute("formaction",snapshot.val()) ;
    });


    onValue(buttonDescriptionRef, (snapshot) => {

            document.getElementById("ticketButton3").innerHTML = snapshot.val();
        }
    );

    if (document.getElementById("ticketButton3").innerHTML == "Invisible") {

        document.getElementById("ticketButton3").hidden = true;

    }

}

//gets the user status (logged in/logged out) and displays the admin menu accordingly
function getUserStatus() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {

            if (user.email === "frostbite.band@hotmail.com") {
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

        if (canvasElement === "logo") {
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



//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {isMobile, albumArray, getAlbums, getLiveGalleryImages, galleryArray};
