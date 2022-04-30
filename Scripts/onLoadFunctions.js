//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant backend calls and registration found below */

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

let backgroundColourGlobal = "";
let outlineColourGlobal = "";
let textColourGlobal = "";


/** The onload function calls a wide variety of functions at startup that makes various different calls to the backend server, this allows the page to always stay up-to-date
 with the newest images, CSS and other page-changing data that has been adjusted by the admin user. It allows the page to be changed by external admins without having to
 edit the source code itself.
 */
document.body.onload = function () {
    getInfoFromServer()
};

/** The getInfoFromServer is a function that preforms multiple server calls whenever the page is visited, it gets various data such as images, CSS and other page-changing data
 from the backend server. The specific data that is fetched from the server is the banner image, outline colour, text colour, background colour (for both the background and icons),
 bannerText status (if the "FROSTBITE" text is shown/hidden), the titleText (the text below "FROSTBITE: The Story",
 the user status (if the user is logged into an admin account or not), the singles/albums, the youtube URL-ID for the youtube embed, the gallery images,
 as well as images, if the device is a mobile phone or not, the cookie status, and the ticket buttons */
function getInfoFromServer() {
    getBannerImage();
    getOutlineColour();
    getTextColour();
    getBackgroundColour();
    getBannerTextStatus();
    getTitleText();
    getUserStatus();
    getAlbums();
    getYouTubeVideoURL();
    getLiveGalleryImages();
    checkIfMobile();
    checkConsentStatus();
    getTicketButtonLink("ticketButton");
    getTicketButtonLink("ticketButton2");
    getTicketButtonLink("ticketButton3");
}

/** The "checkIfMobile" function checks whether or not the decide that is used when visiting the site is a mobile phone or not, this decision is based on the device width,
 any device with less than 1000px width is considered to be a mobile phone. The result is then stored in a variable that is accessible to the entire file, it is also exported
 to other functions that requires this knowledge */
let isMobile = false;

function checkIfMobile() {
    //checks the device width of the device that is used to visit the website with
    if (window.matchMedia('(max-device-width: 1000px)').matches) {
        //assigns true isMobile if the device has a width that is less than 1000px
        isMobile = true;
    }
}

/** The "getBannerImage" function makes a call to the backend server to fetch the background banner image URL, this is the image that is used to achieve the parallax effect on
 PC devices, after the image is fetched from firebase, it is successfully set as the main background on the first layer to the website */
function getBannerImage() {
    //gets the URL to the background image stored in the backend server
    getDownloadURL(refStorage(storage, 'bannerImage'))
        .then((url) => {
            //once the image URL has been fetched, it is applied to the first layer of the page
            const backgroundPara = document.getElementById('backgroundPara');
            backgroundPara.style.backgroundImage = "url('" + url + "')";
        })
}

/** The "getAlbums" function makes a call to the backend server to fetch all of the singles/albums to Frostbite,
 this function is usually only called on startup, but is also called whenever the admin adds or deletes a single/album from the server (via the admin menu on the page) */
let albumArray = [];

function getAlbums() {

    //clears the album array to not stack singles/albums whenever the function is called
    albumArray = [];

    //clears the single/album grid to avoid stacking singles/albums whenever this function is called
    const gridToReset = document.getElementById("gridContainer");
    gridToReset.innerHTML = '';

    //gets a reference to the single/album covers in the backend server
    const listRef = refStorage(storage, 'AlbumCovers');

    //goes through every single/album stored in the server and adds them to the albumArray, then calls the "createAlbumElements" function once all singles/albums has been fetched
    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                //adds the current element to the albumArray
                albumArray[albumArray.length] = itemRef;
            });
        }).then(() => {
        //calls the "createAlbumElements" function once every single/album has been fetched from firebase
        createAlbumElements(albumArray).then(() => "done");
    }).catch(() => {
        //displays a relevant error message in the reusable feedback window if the single/album call somehow fails
        enablePopUpWindow("Unable to fetch covers");
    });
}

/** The "createAlbumElements" function takes all of the elements stored in the albumArray, decodes them, then sorts the albumArray based on the server upload date to each element,
 the function then creates new single/album elements within the page via HTML to display all of the singles/albums to the user, this makes sure that the singles/albums are always
 in the correct order since the fetch times of each image might vary on image size, connection speed and other external constraints */
async function createAlbumElements(albumArray) {

    //defines a new single/album array that will contain the sorted singles/albums
    let sortedArray = [];

    //goes through every element in the original array, decodes their names, then adds the decoded and split values into the new array
    for (const element of albumArray) {
        //gets the name of the file
        const nameToFile = element.name.toString();

        //decodes the placeholder letter "Ø" in the file name with "/" slashes to make the URLs and date valid again
        const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");

        //splits the file name in half to get the server upload date and music URL
        const dateToConvert = albumURL_Decoded.substring(0, 19);
        let musicLink = albumURL_Decoded.substring(19);

        //converts the firebase date to the correct format
        let dateToSet = dateToConvert.toDate("dd/mm/yyyy hh:ii:ss");

        //gets the raw image URL to the current element from firebase
        let imageUrl = await getDownloadURL(element);

        //adds all of the values to the new sorted array
        sortedArray.push({musicLink: musicLink, date: dateToSet, image: imageUrl})
    }

    //sorts the "sortedArray" based on the server upload date, this assures that the singles/albums are in the correct order
    sortedArray.sort(function (a, b) {
        return a.date - b.date;
    });

    //goes through every element in the sorted array, then creates a new single/album HTML element of the current item in the array
    for (const element of sortedArray) {
        //defines two new single/album elements
        const divElement = document.createElement("div");
        const addAlbum = document.createElement("img");

        //applies the image URL from the current array item to the newly created HTML album constant
        addAlbum.src = element.image;
        addAlbum.className = "albumImage";

        //adds an onclick feature that calls a function that opens the music URL in a new tab instead of using the same window
        addAlbum.onclick = function () {
            openInNewTab(element.musicLink)
        }

        //applies the new album to the grid element
        divElement.appendChild(addAlbum);

        //gives the grid element a name to apply CSS accordingly
        divElement.className = "coverGridItem";

        //gets the current single/album grid and adds the new single/album to it
        document.getElementById("gridContainer").insertBefore(divElement, document.getElementById("gridContainer").firstChild);
    }
}

/** The "getLiveGalleryImages" function makes a call to the backend server to fetch all of the gallery images */
let galleryArray = [];

function getLiveGalleryImages() {
    //clears the current galleryArray out as to not stack images when fetching the albums from firebase
    galleryArray = [];

    //gets the gallery and dots from the HTML gallery, then saves it in constants
    const galleryToReset = document.getElementById("galleryImages");
    const dotsToReset = document.getElementById("dots");

    //resets the values of the gallery and dots
    galleryToReset.innerHTML = '';
    dotsToReset.innerHTML = '';

    //creates a gallery reference to the server
    const listRef = refStorage(storage, 'LiveGallery');

    //goes through all of the gallery images on the server and adds them to a galleryArray,
    //then calls the "createGalleryElements" function to display the newly fetched singles/albums
    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                //adds the current item to the gallery array
                galleryArray[galleryArray.length] = itemRef;
            });
        }).then(() => {

        //clears the current timeout in the image gallery (timeout between each image cycle)
        clearTimeout(timeout);

        //calls the "createGalleryElements" function that creates new HTML elements based on the items in the gallery array
        createGalleryElements(galleryArray).then(() => "done");
    }).catch(() => {
        //displays a relevant error message in the reusable feedback window if the fetchGallery call somehow fails
        enablePopUpWindow("Unable to fetch images");
    });
}

/** The "createGalleryElements" function creates and displays new HTML images on the website based on all of the elements currently stored within the gallery array */
let slideIndex = 0;

async function createGalleryElements(galleryArray) {

    let sortedGalleryPaths = [];

    //goes through all of the elements currently stored in the gallery array, decodes them, splits them, then adds them to a new sorted gallery array
    for (const element of galleryArray) {

        //gets the file name
        const nameToFile = element.name.toString();

        //replaces the placeholder "Ø"s with "/" slashes to make the date valid again
        const galleryImageURL_Decoded = nameToFile.replace(/Ø/g, "/");

        //Splits the date and title of the filename to specifically get only the server upload date
        const dateToConvert = galleryImageURL_Decoded.substring(0, 19);

        //converts the server upload date string to a date object, then fetches the image URL to the current array item
        let dateToSet = dateToConvert.toDate("dd/mm/yyyy hh:ii:ss");
        let imageUrl = await getDownloadURL(element);

        //adds the extracted information to a new sorted gallery array
        sortedGalleryPaths.push({image: imageUrl, date: dateToSet})
    }

    //sorts the sorted gallery array based on the server upload date to the elements, this is accomplished through the recently converted date objects
    sortedGalleryPaths.sort(function (a, b) {
        return a.date - b.date;
    });

    //goes through every element in the sorted gallery array and creates HTML elements displayed on the page accordingly, the sorted array is used to
    //always display the gallery images in the correct order, as they might get fetched from the server in different orders due to external reasons such as
    //internet speed, image size, and other external data that might affect the fetch time.
    for (const element of sortedGalleryPaths) {

        //creates two new element constants
        const galleryElement = document.createElement("div");
        const image = document.createElement("img");

        //adds the image URL to the HTML image object, as well as providing a name for the current constant to apply CSS to it accordingly when it is added to the page
        image.src = element.image;
        image.className = "galleryImage";

        //adds the image element to the gallery element, as well as applying a slideFade name to it to apply the fade effect accordingly
        galleryElement.appendChild(image);
        galleryElement.className = "imageSlide fade";

        //adds the newly defined element to the HTML to make it visible on the page
        document.getElementById("galleryImages").insertBefore(galleryElement, document.getElementById("galleryImages").firstChild);

        //defines a new clickable "dot" that is displayed below the gallery, this not only shows the currently selected image, but also allows the user to select any
        //image in the gallery to view it without having to go through the entire cycle again
        const dot = document.createElement("span");
        dot.className = "dot";

        //applies a changeCurrentSlide function that allows users to change slide by clicking on the different dots found below the images in the gallery
        dot.onclick = function () {
            changeCurrentSlide(sortedGalleryPaths.indexOf(element))
        };

        //adds a pointer event to the dots to show the users they are clickable
        dot.style.cursor = "pointer";

        //applies the new dot element to the dots currently displayed on the page
        document.getElementById("dots").appendChild(dot);

    }

    //fetches the gallery again to get the updated gallery images
    showSlides();
}

/** The "showSlides" function cycles through every element in the gallery and displays the next image in the gallery after 3.75 seconds
 * This function is adapted from "https://www.w3schools.com/howto/howto_js_slideshow.asp" */
let timeout = null;

function showSlides() {

    //gets the image slider and the dots (dots are used to display the currently shown image, and are clickable by the user)
    let i;
    let slides = document.getElementsByClassName("imageSlide");
    let dots = document.getElementsByClassName("dot");

    //hides the current image
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    //increases the current value in the slideIndex
    slideIndex++;

    //if the sideIndex is larger than the length of the slides themselves, reset the currently displayed image to 1
    if (slideIndex > slides.length) {
        slideIndex = 1
    }

    //replaces the currently active image
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    //displays the next image, as well as adding the "active" tag to it
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";

    //sets a timeout that restarts the function every 3.75 seconds
    timeout = setTimeout(showSlides, 3750);
}

/** The "changeCurrentSlide" function allows a user to click on any of the dots in the gallery to display a specific image instead of waiting for the gallery cycle */
function changeCurrentSlide(slideToFocus) {
    //clears the current gallery timeout that is added before cycling to the next image (so the user gets 3.75 new seconds to look at the selected image)
    clearTimeout(timeout);

    //adjusts the slideIndex to match the gallery image corresponding with the clicked dot
    slideIndex = slideToFocus;

    //shows the relevant image in the gallery through the "showSlides" function
    showSlides();
}

/** The "openInNewTab" function opens a link in a new tab instead of using the current window */
function openInNewTab(link) {
    window.open(link);
}

/** The "string.prototype.toDate" function creates a new date object based on a date string provided in the parameters
 * This function has been adapted from Arivan Bastos answer in stackoverflow "https://stackoverflow.com/questions/5619202/parsing-a-string-to-a-date-in-javascript" */
String.prototype.toDate = function (format) {

    //defines the normalized formats
    const normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
    const normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    const formatItems = normalizedFormat.split('-');
    const dateItems = normalized.split('-');

    //defines date constants
    const monthIndex = formatItems.indexOf("mm");
    const dayIndex = formatItems.indexOf("dd");
    const yearIndex = formatItems.indexOf("yyyy");
    const hourIndex = formatItems.indexOf("hh");
    const minutesIndex = formatItems.indexOf("ii");
    const secondsIndex = formatItems.indexOf("ss");

    //defines a new date in the universal date object based on information given by the parameter date
    const today = new Date();
    const year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
    const month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
    const day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();
    const hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
    const minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
    const second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

    //returns the new universal date object
    return new Date(year, month, day, hour, minute, second);
};

/** The "getBannerTextStatus" function fetches the toggle status to the "FROSTBITE" headline on the second layer displayed over the main parallax background image, then
 *  hides/shows it accordingly */
function getBannerTextStatus() {
    //creates a reference to the bannerStatus in the backend
    const bannerTextStatus = ref(db, 'toggleBannerStatus/status');
    onValue(bannerTextStatus, (snapshot) => {

        //applies the snapshot value to a local variable then defines the bannerText and toggleButton
        let toggleStatus = snapshot.val();
        let bannerText = document.getElementById("bannerText");
        let aboutTitle = document.getElementById("aboutTitle");
        let toggleButton = document.getElementById("toggleBannerText");

        //if the toggle status is ON, the banner text is displayed and the button features an "Overlay: ON" text
        if (toggleStatus === "ON") {
            bannerText.style.display = "block";
            aboutTitle.style.marginTop = "-1.5vw"
            toggleButton.innerHTML = "Overlay: ON"
        } else {
            //if the toggle status is OFF, the banner text is hidden and the button features an "Overlay: OFF" text
            bannerText.style.display = "none";
            aboutTitle.style.marginTop = "4.27vw"
            toggleButton.innerHTML = "Overlay: OFF"
        }
    });
}

/** The "getTitleText" function fetches the text corresponding with the "FROSTBITE: The Story" section of the page, then applies the fetched text accordingly to said element */
function getTitleText() {
    //creates a backend reference to the story text
    const userStatus = ref(db, 'titleText/titleTextContent');
    onValue(userStatus, (snapshot) => {
        //once fetched, the new story text is applied to the story text element
        document.getElementById("aboutText").innerHTML = snapshot.val();
    });
}

/** The "getYouTubeVideoURL" function fetches the URL-ID to the youtube embed, then applies the corresponding youtube video to it */
function getYouTubeVideoURL() {
    //creates a backend reference to the youtube URL-ID
    const userStatus = ref(db, 'youtubeURL/youtubeURLContent');
    onValue(userStatus, (snapshot) => {
        //once fetched, the youtube embed is set to display the youtube video corresponding with the URL-ID fetched from the server
        document.getElementById("youtubePreviewVideo").src = "https://www.youtube.com/embed/" + snapshot.val();
    });
}

/** The "getTicketButtonLink" function gets the button details to a specified ticket button from firebase, then updates the button accordingly */
function getTicketButtonLink(ticketButton) {

    //creates a backend reference to the ticketButton specified by the parameter
    const buttonHyperLinkRef = ref(db, 'ticketButtons/' + ticketButton + '/hyperlink');
    onValue(buttonHyperLinkRef, (snapshot) => {
        //once fetched, the ticket HTML element is set to correspond with the fetched snapshot value
        document.getElementById(ticketButton).setAttribute("formaction", snapshot.val());

        //gets the description reference to the button corresponding with the parameter value
        const buttonDescriptionRef = ref(db, 'ticketButtons/' + ticketButton + '/description');
        onValue(buttonDescriptionRef, (snapshot) => {

            //once fetched, the button is either displayed with the relevant fetched information, or hidden, based on the contents of the fetched data
            if (snapshot.val().toLowerCase() === "remove") {
                //hides the parameter-defined button if the description of said button is "remove"
                document.getElementById(ticketButton).style.display = "none";

            } else {
                //applies the newly fetched values from the server to the button, as well as displaying it if the values are valid (not hidden/removed)
                document.getElementById(ticketButton).style.display = "block";
                document.getElementById("ticket_placeholder").style.display = "none";
                document.getElementById(ticketButton).innerHTML = snapshot.val();
            }
        });
    });
}

/** The "getUserStatus" function fetches the user status and validates whether or not a visitor is logged in as an authorized admin, the admin menu is then removed/shown accordingly */
function getUserStatus() {
    //creates a reference to the firebase authorization
    const auth = getAuth();

    //whenever the user status is updated, the admin menu is shown/hidden based on the action of the user and the data of the account
    onAuthStateChanged(auth, (user) => {
        if (user) {

            //if the current user email corresponds with the admin account, the admin menu is displayed, keep in mind that the admin functions are only usable if the user is
            //authorized as an admin, this cannot be bypassed or spoofed in any way, even if someone manages to display the admin menu by manipulating the CSS
            //security is one of our main priorities
            if (user.email === "frostbite.band@hotmail.com") {
                document.getElementById("adminContainer").style.display = "block";
                document.getElementById("adminLogin").style.display = "none";
            }

        } else {
            //if no admin is logged in, no admin menu will be displayed
            document.getElementById("adminContainer").style.display = "none";
        }
    });
}

/** The "getOutlineColour" function fetches the outline colour to the website from the server, the colour is saved as a HEX colour code and is applied to all elements that
 corresponds with the outline */
function getOutlineColour() {
    //creates an outlineColour reference to firebase
    const newOutlineColour = ref(db, 'outlineColour/HexCode');

    onValue(newOutlineColour, (snapshot) => {
        //when fetched, applies the HEX colour code to the global outline variable in the CSS file, then updates the site according to the new style
        const bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.style.setProperty('--outlineColor', snapshot.val());
        outlineColourGlobal = snapshot.val();

        //defines a reference to the frostbite logo
        let frostbiteLogo = "./Pictures/frostbiteLogo.png";

        //defines references to the socials images in the socials section of the page
        let spotifySocials = "./Pictures/socialsSpotifyImage.png";
        let facebookSocials = "./Pictures/socialsFacebookImage.png";
        let instagramSocials = "./Pictures/socialsInstagramImage.png";
        let youtubeSocials = "./Pictures/socialsYoutubeImage.png";

        //defines rgb values
        const r = hex_to_RGB(snapshot.val()).r
        const g = hex_to_RGB(snapshot.val()).g;
        const b = hex_to_RGB(snapshot.val()).b;

        //calls a function that updates the colours in the frostbite logo to correspond with the fetched HEX colour code
        updateBackgroundColour(frostbiteLogo, r, g, b, "logo");

        //calls a function that updates the colours in the socials images to correspond with the fetched HEX colour code

        updateBackgroundColour(spotifySocials, r, g, b, "socialsSpotify");
        updateBackgroundColour(facebookSocials, r, g, b, "socialsFacebook");
        updateBackgroundColour(instagramSocials, r, g, b, "socialsInstagram");
        updateBackgroundColour(youtubeSocials, r, g, b, "socialsYoutube");
    });
}

/** The "getBackgroundColour" function fetches the background colour to the website from the server, the colour is saved as a HEX colour code and is applied to all elements that
 corresponds with the background */
function getBackgroundColour() {
    //creates a firebase reference to the background colour
    const newBackgroundColour = ref(db, 'backgroundColour/HexCode');

    onValue(newBackgroundColour, (snapshot) => {
        //once fetched, applies the HEX colour code to the global background variable in the CSS file, then updates the site according to the new style
        const bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.style.setProperty('--backgroundColour', snapshot.val());
        backgroundColourGlobal = snapshot.val();
        getBackgroundColourForImages(snapshot.val());
    });
}

/** The "getTextColour" function fetches the text colour to the website from the server, the colour is saved as a HEX colour code and is applied to all elements that
 corresponds with the background */
function getTextColour() {
    //creates a firebase reference to the text colour
    const newTextColour = ref(db, 'textColour/HexCode');

    onValue(newTextColour, (snapshot) => {
        //once fetched, applies the HEX colour code to the global text variable in the CSS file, then updates the site according to the new style
        const bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.style.setProperty('--textColour', snapshot.val());
        textColourGlobal = snapshot.val();
    });
}

/** The "getBackgroundColourForImages" function fetches and applies the background colour to the images on the page, this is accomplished by manipulating the pixels in the
 images through the "updateBackgroundColour" function*/
function getBackgroundColourForImages(colour) {

    //defines references to the socials images in the navbar
    let youtubeImage = "./Pictures/YoutubeInverted.png";
    let instagramImage = "./Pictures/InstagramInverted.png";
    let facebookImage = "./Pictures/FacebookInverted.png";

    //converts the HEX colour code fetched from firebase to RGB values
    const r = hex_to_RGB(colour).r
    const g = hex_to_RGB(colour).g;
    const b = hex_to_RGB(colour).b;

    //manipulates the pixels in the navbar social images section to correspond with the fetched colour by redrawing the images using new canvases
    updateBackgroundColour(youtubeImage, r, g, b, "youtubeLogo");
    updateBackgroundColour(instagramImage, r, g, b, "instagramLogo");
    updateBackgroundColour(facebookImage, r, g, b, "facebookLogo");
}

/** The "updateBackgroundColour" function manipulates the colour of a given image based on the parameter values, this is accomplished by redrawing the image with the newly defined
 colours in a fresh canvas, then adding the data to an image object and updating it accordingly*/
function updateBackgroundColour(imgSrc, R, G, B, canvasElement) {
    //defines a reference to the canvasElement defined in the parameter
    const canvas = document.getElementById(canvasElement);
    const ctx = canvas.getContext('2d');

    //creates a new image file and applies the provided image source to it
    let img = new Image();
    img.src = imgSrc;

    //once loaded, the image will be drawn in the defined canvas with the new defined colours
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

        //if the canvasElement corresponds with the logo of the page, the favicon shown in the tab will also be updated to match the new colour values
        if (canvasElement === "logo") {
            document.getElementById("favicon").href = canvas.toDataURL("image/x-icon");
        }
    }
}

/** The "hex_to_RGB" function converts a given hex colour code to R-G-B values, then returns said values accordingly
 *  This function is adapted from Tim Down's answer in stackoverflow "https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb" */
function hex_to_RGB(hex) {
    const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return {
        //returns the R value of the hex
        r: parseInt(m[1], 16),

        //returns the G value of the hex
        g: parseInt(m[2], 16),

        //returns the B value of the hex
        b: parseInt(m[3], 16)
    };
}


//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {
    isMobile,
    albumArray,
    getAlbums,
    getLiveGalleryImages,
    galleryArray,
    outlineColourGlobal,
    textColourGlobal,
    backgroundColourGlobal
};
