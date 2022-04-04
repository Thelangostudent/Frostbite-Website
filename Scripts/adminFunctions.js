//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>

import {db, storage, popUpInfoWindow, popUpWindowText} from './firebaseInitialization.js'
import {albumArray, galleryArray, getAlbums, getLiveGalleryImages} from './onLoadFunctions.js'

import {ref, set} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {
    getStorage,
    ref as refStorage,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';

//<--------------------------------------------------------- ADMIN FUNCTIONS ---------------------------------------------------------------------------------------->

document.getElementById("changeBackgroundColour").onclick = function () {
    changeBackgroundColour();
}

function changeBackgroundColour() {
    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #141414)")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChangeBackground();
    }
}

function confirmColourChangeBackground() {
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

document.getElementById("changeBackgroundImage").onclick = function () {
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
            uploadBytes(imagesRef, files[0]).then(() => {

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

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

// For today's date;
Date.prototype.today = function () {
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

// uploads an album to firebase
document.getElementById("addAlbumCover").onclick = function () {

    showPopUpAdminValueWindow("Enter the full spotify URL to the single/album you want to add:")

    document.getElementById("acceptNewValueButton").onclick = function () {
        uploadNewAlbumImage();
    }
}

function uploadNewAlbumImage() {
    let newAlbumURL = document.getElementById("newValueContainerValue").value;
    let isValid = isValidHttpUrl(newAlbumURL);

    if (newAlbumURL === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else if (isValid === false) {
        enablePopUpWindow("URL is invalid!");
    } else {

        let alreadyAdded = "false";
        for (const element of albumArray) {
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

                    uploadBytes(imagesRef, files[0]).then(() => {
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

function deleteAlbum() {
    showPopUpAdminValueWindow("Enter the full URL to the single/album you want to delete:")
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmDeleteAlbum().then(() => "done");
    }
}

async function confirmDeleteAlbum() {
    let albumToDelete = document.getElementById("newValueContainerValue").value;
    if (albumToDelete === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else {
        for (const element of albumArray) {
            const nameToFile = element.name.toString();
            const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");
            const albumURL_Decoded_timeRemoved = albumURL_Decoded.substring(19);

            if (albumToDelete === albumURL_Decoded_timeRemoved) {

                const albumRef = refStorage(storage, 'AlbumCovers/' + element.name);

                deleteObject(albumRef).then(() => {
                    enablePopUpWindow("Single/Album deleted!");
                    getAlbums();
                }).catch(() => {
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

document.getElementById("addLiveImage").onclick = function () {
    uploadGalleryImage();
}

//uploads gallery image to FireBase
function uploadGalleryImage() {

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

            const fileName = "GalleryImage"

            const galleryImagePathToEncode = datetime + fileName;
            const galleryImage_Encoded = galleryImagePathToEncode.replace(/\//g, "Ø");

            const storage = getStorage();
            const imagesRef = refStorage(storage, 'LiveGallery/' + galleryImage_Encoded);

            uploadBytes(imagesRef, files[0]).then(() => {
                getLiveGalleryImages();
                enablePopUpWindow("Gallery Image added!");
            });
        }
        reader.readAsDataURL((files[0]));
    }
    input.click();

}

document.getElementById("deleteLiveImage").onclick = function () {
    deleteGalleryImage();
}

function deleteGalleryImage() {
    showPopUpAdminValueWindow('Enter the full URL to the gallery image you want to delete:');
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmDeleteGalleryImage().then(() => "done");
    }
}

async function confirmDeleteGalleryImage() {
    let galleryImageToDelete = document.getElementById("newValueContainerValue").value;

    if (galleryImageToDelete === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else {
        for (const element of galleryArray) {

            let imageUrl = await getDownloadURL(element);

            if (galleryImageToDelete === imageUrl) {

                const galleryImageRef = refStorage(storage, 'LiveGallery/' + element.name);

                deleteObject(galleryImageRef).then(() => {
                    enablePopUpWindow("Gallery Image deleted!");
                    getLiveGalleryImages();
                }).catch(() => {
                    enablePopUpWindow("Unable to delete gallery image");
                });

                closeNewValueContainerWindow();
                resetNewAdminValue();
                return;

            }
        }

        enablePopUpWindow("Unable to find gallery image");

    }
}

/**
 * initialises a popup window that asks the admin two things:
 * General info (date,place, eventname etc...)
 * The hyperlink to the ticket sales site
 * */
function addNewTicketButton(){


}

/**
 * Removes a ticket button by removing the info related to a button.
 * FB is called and the info is removed.
 * The original hyperlink is used as the identifier for which button to remove.
 * */
function deleteTicketButton(){


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

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {enablePopUpWindow}
