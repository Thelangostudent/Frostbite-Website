//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {db, storage, popUpInfoWindow, popUpWindowText} from './firebaseInitialization.js'
import {
    albumArray,
    galleryArray,
    getAlbums,
    getLiveGalleryImages,
} from './onLoadFunctions.js'

import {ref, set} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {
    getStorage,
    ref as refStorage,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';

//<--------------------------------------------------------- ADMIN FUNCTIONS ---------------------------------------------------------------------------------------->

/** Code that fetches the changeBackgroundColour button in the admin menu and adds the relevant function to it */
document.getElementById("changeBackgroundColour").onclick = function () {
    changeBackgroundColour();
}

/** Function that displays the reusable input overlay to an authorized admin after clicking on the "changeBackgroundColour" button in the admin menu,
 * the function then calls the "confirmColourChangeBackground" function, which takes the input and changes the background colour of the page to the HEX colour,
 ONLY if the input is a valid HEX colour, a relevant "wrong input" feedback message will be displayed otherwise */
function changeBackgroundColour() {

    //calls the reusable input overlay function with the relevant input information
    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #141414)")

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChangeBackground();
    }
}

/** The "confirmColourChangeBackground" function validates the admin input and checks whether the input is a valid HEX colour or not.
 * It then updates the background colour value in firebase if the input is a valid hex colour

 *  If the input field is empty, a relevant "input cannot be empty" message will be returned and displayed to the admin.
 *  If the input field is filled in, but is not a valid HEX colour, a relevant "Not a valid HEX colour" message will be returned and displayed to the admin,
 *  If the input field is filled in with a valid HEX colour, the "backgroundColour" value stored in the backend will be updated to match the admin input, the page
 will apply the new background colour instantly */
function confirmColourChangeBackground() {
    //gets the new input value submitted by the admin
    let newBackgroundColour = document.getElementById("newValueContainerValue").value;

    //checks if the input is a valid hex colour
    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    const isValidHex = reg.test(newBackgroundColour);

    if (newBackgroundColour === "") {
        //returns a "field cannot be empty" message if the input field is empty
        enablePopUpWindow("Field cannot be empty!");
    } else if (isValidHex === true) {
        //updates the firebase backgroundColour value if the input is a valid HEX colour
        set(ref(db, 'backgroundColour'), {
            HexCode: newBackgroundColour,
        });

        //displays a "colour updated" feedback message to the admin
        enablePopUpWindow("Colour updated!");

        //calls the "closeNewValueContainerWindow" function which closes the reusable input field window
        closeNewValueContainerWindow();

        //calls the "resetNewAdminValue" function which resets the input fields within the reusable input field window
        resetNewAdminValue();
    } else {
        //displays a "not a valid hex colour!" message if the input is not a valid hex colour
        enablePopUpWindow("Not a valid HEX colour!");
    }
}

/** Code that fetches the changeOutlineColour button in the admin menu and adds the relevant function to it */
document.getElementById("changeOutlineColour").onclick = function () {
    changeOutlineColour();
}

/** Function that displays the reusable input overlay to an authorized admin after clicking on the "changeOutlineColour" button in the admin menu,
 * the function then calls the "confirmColourChange" function, which takes the input and changes the background colour of the page to the HEX colour,
 ONLY if the input is a valid HEX colour, a relevant "wrong input" feedback message will be displayed otherwise */
function changeOutlineColour() {

    //calls the reusable input overlay function with the relevant input information
    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #a14a95)");

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChange();
    }
}

/** The "confirmColourChange" function validates the admin input and checks whether the input is a valid HEX colour or not.
 * It then updates the outline colour value in firebase if the input is a valid hex colour

 *  If the input field is empty, a relevant "input cannot be empty" message will be returned and displayed to the admin.
 *  If the input field is filled in, but is not a valid HEX colour, a relevant "Not a valid HEX colour" message will be returned and displayed to the admin,
 *  If the input field is filled in with a valid HEX colour, the "outlineColour" value stored in the backend will be updated to match the admin input, the page
 will apply the new outline colour instantly */
function confirmColourChange() {
    //gets the new input value submitted by the admin
    let newOutlineColour = document.getElementById("newValueContainerValue").value;

    //checks if the input is a valid hex colour
    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    const isValidHex = reg.test(newOutlineColour);

    if (newOutlineColour === "") {
        //returns a "field cannot be empty" message if the input field is empty
        enablePopUpWindow("Field cannot be empty!");
    } else if (isValidHex === true) {
        //updates the firebase outlineColour value if the input is a valid HEX colour
        set(ref(db, 'outlineColour'), {
            HexCode: newOutlineColour,
        });

        //displays a "colour updated" feedback message to the admin
        enablePopUpWindow("Colour updated!");

        //calls the "closeNewValueContainerWindow" function which closes the reusable input field window
        closeNewValueContainerWindow();

        //calls the "resetNewAdminValue" function which resets the input fields within the reusable input field window
        resetNewAdminValue();
    } else {
        //displays a "not a valid hex colour!" message if the input is not a valid hex colour
        enablePopUpWindow("Not a valid HEX colour!");
    }
}

/** Code that fetches the changeTextColour button in the admin menu and adds the relevant function to it */
document.getElementById("changeTextColour").onclick = function () {
    changeTextColour();
}

/** Function that displays the reusable input overlay to an authorized admin after clicking on the "changeTextColour" button in the admin menu,
 * the function then calls the "confirmColourChangeOnText" function, which takes the input and changes the background colour of the page to the HEX colour,
 ONLY if the input is a valid HEX colour, a relevant "wrong input" feedback message will be displayed otherwise */
function changeTextColour() {

    //calls the reusable input overlay function with the relevant input information
    showPopUpAdminValueWindow("Enter the new HEX colour code (example: #ffffff)");

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmColourChangeOnText();
    }
}

/** The "confirmColourChangeOnText" function validates the admin input and checks whether the input is a valid HEX colour or not.
 * It then updates the text colour value in firebase if the input is a valid hex colour

 *  If the input field is empty, a relevant "input cannot be empty" message will be returned and displayed to the admin.
 *  If the input field is filled in, but is not a valid HEX colour, a relevant "Not a valid HEX colour" message will be returned and displayed to the admin,
 *  If the input field is filled in with a valid HEX colour, the "textColour" value stored in the backend will be updated to match the admin input, the page
 will apply the new text colour instantly */
function confirmColourChangeOnText() {
    //gets the new input value submitted by the admin
    let newTextColour = document.getElementById("newValueContainerValue").value;

    //checks if the input is a valid hex colour
    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    const isValidHex = reg.test(newTextColour);

    if (newTextColour === "") {
        //returns a "field cannot be empty" message if the input field is empty
        enablePopUpWindow("Field cannot be empty!");
    } else if (isValidHex === true) {
        //updates the firebase textColour value if the input is a valid HEX colour
        set(ref(db, 'textColour'), {
            HexCode: newTextColour,
        });

        //displays a "colour updated" feedback message to the admin
        enablePopUpWindow("Colour updated!");

        //calls the "closeNewValueContainerWindow" function which closes the reusable input field window
        closeNewValueContainerWindow();

        //calls the "resetNewAdminValue" function which resets the input fields within the reusable input field window
        resetNewAdminValue();
    } else {
        //displays a "not a valid hex colour!" message if the input is not a valid hex colour
        enablePopUpWindow("Not a valid HEX colour!");
    }
}

/** Code that fetches the changeBackgroundImage button in the admin menu and adds the relevant function to it */
document.getElementById("changeBackgroundImage").onclick = function () {
    changeBackgroundImage();
}

/** The "changeBackgroundImage" function opens a file selector that allows the admin to upload a new background image under 200kb.
 *  If an admin tries to upload an image that has higher file size than 200kb, a relevant "file too large" feedback message will be displayed.
 *  The main reason to why there is a file size limit on the website is to maintain fast loading times, as well as staying way inside the daily bandwidth limit our googles backend. */
function changeBackgroundImage() {

    let files = [];
    let reader;

    //creates a definition of the input type in the file selector, main file types that are selectable by default are PNGs, JPGs and GIFs
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/png, image/jpg, image/jpeg, image/gif";

    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function () {

            //checks the file size limit
            if (files[0].size > 200000) {
                enablePopUpWindow("File too large! Max 200kb");
            } else {

                //gets a reference to the file storage to the bannerImage in firebase
                const storage = getStorage();
                const imagesRef = refStorage(storage, 'bannerImage');

                //uploads the new image to firebase
                uploadBytes(imagesRef, files[0]).then(() => {

                    //gets the new image from firebase and updates the banner
                    getDownloadURL(refStorage(storage, 'bannerImage'))
                        .then((url) => {
                            const backgroundPara = document.getElementById('backgroundPara');
                            backgroundPara.style.backgroundImage = "url('" + url + "')";

                            //returns a "banner updated" feedback message to the admin
                            enablePopUpWindow("Banner updated!");
                        })
                });
            }
        }
        reader.readAsDataURL((files[0]));
    }
    input.click();
}

/** Code that fetches the toggleBannerText button in the admin menu and adds the relevant function to it */
document.getElementById("toggleBannerText").onclick = function () {
    toggleBannerTitle();
}

/** The "toggleBannerTitle" function allows an admin to toggle the "FROSTBITE" banner text, this feature is useful if the band wants to use background images that are
 otherwise obstructed by the banner text */
function toggleBannerTitle() {

    //Gets the innerHTML of the "toggleBannerText" constant
    let status = document.getElementById("toggleBannerText").innerHTML;

    //if the status is "ON" when the button is pressed, the status will be updated to "OFF" in the firebase
    if (status === "Overlay: ON") {
        set(ref(db, 'toggleBannerStatus'), {
            status: "OFF",
        });
        document.getElementById("toggleBannerText").innerHTML = "Overlay: OFF"

        //if the status is "OFF" when the button is pressed, the status will be updated to "ON" in the firebase
    } else {
        set(ref(db, 'toggleBannerStatus'), {
            status: "ON",
        });
        document.getElementById("toggleBannerText").innerHTML = "Overlay: ON"
    }

}

/** Code that fetches the changeText button in the admin menu and adds the relevant function to it */
document.getElementById("changeText").onclick = function () {
    changeText();
}

/** The "changeText" function allows an authorized admin to change the story text that is displayed on the page by either writing or simply pasting a new story
 text into the input field that gets displayed when the "changeText" button is pressed, then hitting "accept", the text is updated instantly */
function changeText() {

    //calls the reusable input overlay function with the relevant input information
    showPopUpAdminValueWindow("Please copy & paste your new story text here")

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules, in this case it calls "confirmChangeText"
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmChangeText();
    }
}

/** The "confirmChangeText" function gets tne input value to the potentially new story text and checks if it's empty or not.
 *  If the input field is empty, a "field cannot be empty!" feedback message is displayed to the admin
 *  If the input field is filled in, the story text stored in our firebase backend will be updated accordingly */
function confirmChangeText() {
    //gets the new value from the reusable input window
    let newText = document.getElementById("newValueContainerValue").value;


    if (newText === "") {
        //returns a "field cannot be empty" message if the input field is empty
        enablePopUpWindow("Field cannot be empty!");
    } else {
        //Updates the firebase titleText value if the input is not empty
        set(ref(db, 'titleText'), {
            titleTextContent: newText,
        });

        //displays a "story updated!" feedback message to the admin
        enablePopUpWindow("Story updated!");

        //calls the "closeNewValueContainerWindow" function which closes the reusable input window
        closeNewValueContainerWindow();

        //calls the "resetNewAdminValue" function which resets the input fields within the reusable input field window
        resetNewAdminValue();
    }
}

/** Useful function that validates whether or not a string is a valid HTTP url
 *  made by the help of Pavlo's great answer in stackoverflow: "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/45567717" */
function isValidHttpUrl(string) {
    let url;

    try {
        //tries to create a new URL out of the given string
        url = new URL(string);
    } catch (_) {
        //returns false if the URL is not valid
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

/**  Function that gets the current date at the time of the function call
 * made by the help of Mark Walters great answer in stackoverflow: "https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript" */
Date.prototype.today = function () {
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

/**  Function that gets the current time at the time of the function call
 * made by the help of Mark Walters great answer in stackoverflow: "https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript" **/
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

/** Code that fetches the addAlbumCover button in the admin menu and adds the relevant function to it */
document.getElementById("addAlbumCover").onclick = function () {

    //calls the reusable input overlay function with the relevant input information
    showPopUpAdminValueWindow("Enter the full spotify URL to the single/album you want to add:")

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules, in this case it calls "uploadNewAlbumImage"
    document.getElementById("acceptNewValueButton").onclick = function () {
        uploadNewAlbumImage();
    }
}

/** The "uploadNewAlbumImage" function allows an authorized admin to create and upload a new single/album icon and connect a URL to it (usually link to the spotify song) by
 *  first validating if the input is a valid HTTP link, then allowing the admin to upload a new image file under 200kb, the single/album is instantly added to the firebase backend
 *  and shown on the website if all the inputs are valid and within the limits */
function uploadNewAlbumImage() {

    //checks if the admin input is a valid HTTP link by calling the isValidHttpUrl function by using said input as a parameter
    let newAlbumURL = document.getElementById("newValueContainerValue").value;
    let isValid = isValidHttpUrl(newAlbumURL);

    if (newAlbumURL === "") {
        //returns a "field cannot be empty" message if the input field is empty
        enablePopUpWindow("Field cannot be empty!");
    } else if (isValid === false) {
        //returns a "URL is invalid!" message if the input field contains an invalid HTTP link
        enablePopUpWindow("URL is invalid!");
    } else {

        //If the URL is valid, the function then checks through all of the singles/albums that are already on the page to verify
        //if the single/album has already been added or not. If checks this by decrypting the single/album database string, splitting it in half and then checking
        //if the URL that is extracted from the database string matches the new URL admin input, if it does, an error message is displayed to the admin
        let alreadyAdded = "false";
        for (const element of albumArray) {

            //gets the name to the selected element within the albumArray
            const nameToFile = element.name.toString();

            //replaces the placeholder letter "Ø" with "/" slashes to make the stored links valid again
            const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");

            //removes the timestamp saved onto the server string to only get the URL that has been saved to this single/album
            const albumURL_Decoded_timeRemoved = albumURL_Decoded.substring(19);

            //compares the extracted URL string to the new admin input string and returns a "single/album already added!" error message if the single/album has already
            //been added to the website/database
            if (newAlbumURL === albumURL_Decoded_timeRemoved) {
                enablePopUpWindow("Single/Album already added!");
                alreadyAdded = "true";
            }
        }

        //if the single/album has not been already added, then the function continues by allowing the admin to select a new icon for the new single/album that is about to
        //get uploaded to the site through a file selector. The image size is once again 200kb to maintain a proper bandwidth limit and improve the loading time of the website.
        if (alreadyAdded === "false") {
            let files = [];
            let reader;

            //defines the main filetype that is valid for this function, these filetypes are PNGs, JPGs and GIFS
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = "image/png, image/jpg, image/jpeg, image/gif";

            input.onchange = e => {
                files = e.target.files;
                reader = new FileReader();
                reader.onload = function () {

                    //checks if the chosen file goes over the 200kb limit or not
                    if (files[0].size > 200000) {
                        enablePopUpWindow("File too large! Max 200kb");
                    } else {

                        //creates a new string that consist of the uploadDate and uploadTime, this is used to sort the single/albums in the correct order
                        const newDate = new Date();
                        const datetime = newDate.today() + " " + newDate.timeNow();

                        //the string that is to be saved in the database is then encoded to use the letter "Ø" instead of "/" slashes to avoid confusing google's database logic
                        //since the "/" is a key symbol that automatically creates new folders in googles system, the letter "Ø" is used because no valid global HTTP string
                        //will ever contain that letter
                        const albumPathToEncode = datetime + newAlbumURL;
                        const albumURL_Encoded = albumPathToEncode.replace(/\//g, "Ø");

                        //a new reference is then created in the database based on the new encoded string that contains the single/album URL, as well as the upload date and time
                        const storage = getStorage();
                        const imagesRef = refStorage(storage, 'AlbumCovers/' + albumURL_Encoded);

                        //once the image has been successfully uploaded, the singles/albums on the page are automatically refreshed and the reusable input window is closed and cleared
                        uploadBytes(imagesRef, files[0]).then(() => {

                            //gets the albums with updated values from the database
                            getAlbums();

                            //function that closes the newValueContainer window by using display: none
                            closeNewValueContainerWindow();

                            //function that clears the previous inputs in the reusable input window by using innerHTML = "";
                            resetNewAdminValue();

                            //displays a "single/album added!" message to the admin upon successfully uploading a new single/album to the firebase backend server
                            enablePopUpWindow("Single/Album added!");
                        });
                    }
                }
                reader.readAsDataURL((files[0]));
            }
            input.click();
        }
    }
}

/** Code that fetches the addAlbumCover button in the admin menu and adds the relevant function to it */
document.getElementById("deleteAlbumCover").onclick = function () {
    deleteAlbum();
}

/** The "deleteAlbum" function allows an authorized admin to delete a single/album from the webpage and backend server by simply pasting the link
 to the single/album the admin wants to delete into the input field, the single/album is then instantly removed from both of them */
function deleteAlbum() {

    //calls the reusable input overlay function with the relevant input information
    showPopUpAdminValueWindow("Enter the full URL to the single/album you want to delete:")

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules, in this case it calls "acceptNewValueButton"
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmDeleteAlbum().then(() => "done");
    }
}

/** The "confirmDeleteAlbum" function verifies the URL that is requested to be deleted by the admin by first checking if it exists, and then deleting it by making a backend
 firebase call if said URL exist, this is useful if the band wants to remove an expired or old album they no longer wish to have on their site */
async function confirmDeleteAlbum() {

    //gets the URL that the admin wants to delete from the reusable input window
    let albumToDelete = document.getElementById("newValueContainerValue").value;

    if (albumToDelete === "") {
        //displays a "field cannot be empty!" feedback message in the feedback window if the input is empty
        enablePopUpWindow("Field cannot be empty!");
    } else {
        //if the admin has entered something in the input field, the function then checks if said string matches a URL to any of the singles/albums that are currently
        //stored in the albumArray that got fetched at the last page refresh/upload/deletion by going through the albumArray array.
        for (const element of albumArray) {

            //gets the file name to the element in the albumArray
            const nameToFile = element.name.toString();

            //decodes the stored string by replacing the placeholder "Ø" with "/" slashes.
            const albumURL_Decoded = nameToFile.replace(/Ø/g, "/");

            //splits the string to remove the upload date and only get the URL
            const albumURL_Decoded_timeRemoved = albumURL_Decoded.substring(19);

            //checks if the single/album URL matches the admin input and deletes it if it matches
            if (albumToDelete === albumURL_Decoded_timeRemoved) {

                //creates a backend firebase reference to the single/album that the admin wants to delete
                const albumRef = refStorage(storage, 'AlbumCovers/' + element.name);

                //calls the deleteObject function integrated in firebase's backend systems
                deleteObject(albumRef).then(() => {

                    //displays a reusable feedback window that says "single/album deleted!" to the admin upon successfully deleting a single/album
                    enablePopUpWindow("Single/Album deleted!");

                    //fetches the new and updated albumArray from firebase to keep the site up-to-date without the need to refresh the page
                    getAlbums();
                }).catch(() => {
                    //displays a reusable feedback window that says "unable to delete single/album" to the admin if an unknown error occurs"
                    //this has never happened during development but it's still good to have just in case an unknown error occurs
                    enablePopUpWindow("Unable to delete single/album");
                });

                //calls a function that closes the current reusable input window by hiding it with display: none
                closeNewValueContainerWindow();

                //clears out the current input values in the reusable input window and prepares it for its next use
                resetNewAdminValue();

            } else {
                //displays a reusable feedback window that says "unable to find single/album" if the admin input does not match any singles/albums currently stored
                //in the main albumArray
                enablePopUpWindow("Unable to find single/album");
            }
        }
    }
}

/** Code that fetches the changeYouTubeURL button in the admin menu and adds the relevant function to it */
document.getElementById("changeYouTubeURL").onclick = function () {
    changeYouTubeURL();
}

/** The "changeYouTubeURL" function allows an authorized admin to change the youtube vide that is displayed in the "video" section of the page by entering a new
 youtube video URL-ID into the input field in the reusable input window */
function changeYouTubeURL() {

    //calls the reusable input window and displays the relevant message for this function, as well as including some instructions on how to get the URL-ID from a youtube link
    showPopUpAdminValueWindow("Enter the new YouTube URL-ID (the letters after 'watch?v=')")

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules, in this case it calls "confirmYouTubeURL"
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmYouTubeURL();
    }

}

/** The "confirmYouTubeURL" function checks if the admin input is empty or not.
 * If the input field is empty, a "field cannot be empty" message is displayed to the admin.
 * If the input field is filled in, the backend firebase URL-id to the youtube embed gets updated according to the new admin input value */
function confirmYouTubeURL() {

    //gets the new admin URL-ID value from the input field, taken from the reusable input window
    let newURL = document.getElementById("newValueContainerValue").value;

    if (newURL === "") {
        //displays a "field cannot be empty!" error message in the reusable feedback window by calling the "enablePopUpWindow" function if the admin input is empty
        enablePopUpWindow("Field cannot be empty!");
    } else {
        //updates the youtube URL-ID that is stored in the backend firebase by making a call to said backend with the updated values taken from the admin input window
        set(ref(db, 'youtubeURL'), {
            youtubeURLContent: newURL,
        });

        //calls a function that closes the reusable input window by using display: none
        closeNewValueContainerWindow();

        //clears the current values in the reusable input field window and prepares the window for its next use
        resetNewAdminValue();

        //uses the reusable feedback window to display that the video has been updated to match the new URL-id
        enablePopUpWindow("Video updated!");
    }
}

/** Code that fetches the uploadGalleryImage button in the admin menu and adds the relevant function to it */
document.getElementById("addLiveImage").onclick = function () {
    uploadGalleryImage();
}

/** The "uploadGalleryImage" function allows an authorized admin to upload a new image to the image gallery by opening a new file selector, then sending the selected file
 information to the firebase storage, ONLY if the file is below 200kb, this is to maintain fast loading speed as well as staying well within googles bandwidth limit */
function uploadGalleryImage() {

    let files = [];
    let reader;

    //defines the main file types in the file selector, the main file types here are PNGs, JPGs and GIFS
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/png, image/jpg, image/jpeg, image/gif";

    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function () {

            //checks if the uploaded file has a size that is less than 200kb, returns a relevant error message if this criteria is not met
            if (files[0].size > 200000) {
                enablePopUpWindow("File too large! Max 200kb");
            } else {

                //creates a new constant that consists of today's date, as well as the current time at the moment of the button click
                //this is used to sort the gallery images correctly, as directly fetched images might be fetched in different orders due to file size, internet speed
                //and other unforeseen external interruptions between the client and the server
                const newDate = new Date();
                const datetime = newDate.today() + " " + newDate.timeNow();

                //defines the fileName to the galleryImage
                const fileName = "GalleryImage"

                //encodes the gallery image by mixing the date and the file name, as well as replacing the "/" slashes in the date with "Ø"s to avoid confusion with googles systems
                // since the backend firebase server creates new folders with the key symbol "/", which will mix with the upload dates and URLs
                const galleryImagePathToEncode = datetime + fileName;
                const galleryImage_Encoded = galleryImagePathToEncode.replace(/\//g, "Ø");

                //creates a firebase reference to the newly encoded gallery image
                const storage = getStorage();
                const imagesRef = refStorage(storage, 'LiveGallery/' + galleryImage_Encoded);

                //uploads the new gallery image to the backend firebase server and refreshes the gallery
                uploadBytes(imagesRef, files[0]).then(() => {
                    //calls the "getLiveGalleryImages" function that refreshes the gallery images on the site without having to refresh the whole page
                    getLiveGalleryImages();

                    //displays the feedback message "gallery image added!" to the admin upon successfully uploading a new gallery image by using the reusable feedback window and function
                    enablePopUpWindow("Gallery Image added!");
                });
            }
        }
        reader.readAsDataURL((files[0]));
    }
    input.click();
}

/** Code that fetches the deleteLiveImage button in the admin menu and adds the relevant function to it */
document.getElementById("deleteLiveImage").onclick = function () {
    deleteGalleryImage();
}

/** The "deleteGalleryImage" function allows an authorized admin to delete an image in the gallery by simply pasting the gallery image link into the input field within the
 reusable input window, the gallery gets automatically updated without having to refresh the page */
function deleteGalleryImage() {

    //calls the reusable input window and displays the relevant message for this function
    showPopUpAdminValueWindow('Enter the full URL to the gallery image you want to delete:');

    //adds an onclick feature to the "acceptNewValueButton" button that calls the relevant function within the javascript modules, in this case it calls "confirmDeleteGalleryImage"
    document.getElementById("acceptNewValueButton").onclick = function () {
        confirmDeleteGalleryImage().then(() => "done");
    }
}

/** The "confirmDeleteGalleryImage" function gets the gallery image to delete by checking if the provided gallery image link matches any images currently in the gallery */
async function confirmDeleteGalleryImage() {
    //gets the new admin value from the reusable input window
    let galleryImageToDelete = document.getElementById("newValueContainerValue").value;

    //checks if the new admin input is empty, and returns an error message if it is.
    if (galleryImageToDelete === "") {
        //uses the reusable feedback message window to display a "field cannot be empty" message if the field is indeed empty
        enablePopUpWindow("Field cannot be empty!");
    } else {
        //if the input field is not empty, the function goes through every element in the galleryArray and checks if any element matches the input URL that was provided by the admin
        //through the reusable input window
        for (const element of galleryArray) {

            //creates a new value that consist of the URL (name) to the current gallery image
            let imageUrl = await getDownloadURL(element);

            //compares the current path (name) to the current element in the galleryArray to the URL provided by the admin in the reusable input window,
            //the gallery image is deleted if a match is found
            if (galleryImageToDelete === imageUrl) {

                //gets a reference to firebase with the gallery element that is to be deleted
                const galleryImageRef = refStorage(storage, 'LiveGallery/' + element.name);

                //deletes the gallery element by making a "deleteObject" call to the firebase backend server
                deleteObject(galleryImageRef).then(() => {

                    //displays the message "gallery image deleted" in the reusable gallery feedback window if a gallery image is successfully deleted
                    enablePopUpWindow("Gallery Image deleted!");

                    //fetches the gallery after deleting the specified element to refresh the gallery without having to refresh the page
                    getLiveGalleryImages();
                }).catch(() => {
                    //displays a "unable to delete gallery image" if an unknown error occur
                    enablePopUpWindow("Unable to delete gallery image");
                });

                //calls a function that closes the reusable input window by using display: none
                closeNewValueContainerWindow();

                //resets the values in the reusable admin input window and prepares it for its next use, as well as ending the function here if
                //the specified gallery image has been found and deleted
                resetNewAdminValue();
                return;
            }
        }

        //displays the reusable feedback window with the message "unable to find gallery image" if the link that is provided does not match any image currently stored
        //in the backend firebase server / galleryArray.
        enablePopUpWindow("Unable to find gallery image");

    }
}

/***
 * popup window that asks the admin what description and hyperlink to use.
 * The admin will be able to choose which button to apply the new information to.
 */
function ticketButtonPopUp() {

    //displays the ticket value window to the admin after the change ticket button in the admin menu has been pressed
    document.getElementById("popUpTicketValue").style.display = "block";
    document.getElementById("cancelValueButton").onclick = function () {
        document.getElementById("popUpTicketValue").style.display = "none";
    }

    //activates the confirmTicketButtonChange with ID 1 as parameter, assigns the input field information to button 1
    document.getElementById("enterValueButton1").onclick = function () {
        confirmTicketButtonChange(1);
    }

    //activates the confirmTicketButtonChange with ID 2 as parameter, assigns the input field information to button 2
    document.getElementById("enterValueButton2").onclick = function () {
        confirmTicketButtonChange(2);
    }

    //activates the confirmTicketButtonChange with ID 3 as parameter, assigns the input field information to button 3
    document.getElementById("enterValueButton3").onclick = function () {
        confirmTicketButtonChange(3);
    }
}

/** Code that fetches the addTicketButton button in the admin menu and adds the relevant function to it */
document.getElementById("addTicketButton").onclick = function () {
    ticketButtonPopUp();
}

/**
 * ticket button function that checks if the admin input is valid, as well as uploading and updating the specific ticket button value based on the parameters
 * */
function confirmTicketButtonChange(buttonId) {
    //creates references to the URL and description field to the selected button (from the parameter)
    let newURL = document.getElementById("newTicketValueContainerValue").value;
    let newDescription = document.getElementById("newTicketDescriptionContainerValue").value;

    //defines the ticket button to request from firebase, as well as defining it as just "ticketButton" if it is the first button that gets called
    let ticketButton = "ticketButton" + buttonId;
    if (buttonId === 1){
        ticketButton = "ticketButton";
    }

    //returns the error message "field cannot be empty" in the reusable feedback window if the input field is empty
    if (newURL === "" || newDescription === "") {
        enablePopUpWindow("Field cannot be empty!");
    } else {
            //updates the corresponding ticket button value through firebase calls if the inputs are filled in with relevant information
            set(ref(db, 'ticketButtons/' + ticketButton), {
                hyperlink: newURL,
                description: newDescription,
            });

            //calls a function that closes the reusable input field window by using display: none
            closeNewValueContainerWindow();

            //calls a function that resets the values within the input fields in the reusable input window, as well as preparing it for its next use
            resetNewAdminValue();

            //returns a "ticket button updated" message to the admin through the reusable feedback window after successfully updating a ticket button
            enablePopUpWindow("Ticket Button updated!");
    }
}

/** The function "enablePopUpWindow" displays a feedback message through a reusable feedback message window, the window is displayed to the user for 3.25 seconds before disappearing via a short
    animation that sends it down and back up again, the "text" parameter decides what is says, for example enablePopUpWindow(Hello!) */
function enablePopUpWindow(textToDisplay) {
    //assigns the new value to the reusable feedback window via the parameter
    popUpWindowText.innerHTML = textToDisplay;

    //removes and adds the reusable feedback window to the main body to reset the animation
    document.body.removeChild(popUpInfoWindow);
    document.body.appendChild(popUpInfoWindow);

    //enables the dropdown animation for exactly 3.25s every time this function is called
    popUpInfoWindow.style.animation = "dropDown 3.25s"
}

/** The function "showPopUpAdminValueWindow" displays a reusable input field window that uses a custom description based on the parameter, as well as
    showing an "accept" and "cancel" button to confirm the admins input choice, this function is useful for admin functions that aims to make changes to the website through
    server calls and adjustments */
function showPopUpAdminValueWindow(descriptionOfFeature) {

    //gets the popUpAdminValue window and makes it visible to the admin by applying display: block CSS
    let newValueContainer = document.getElementById("popUpAdminValue");
    newValueContainer.style.display = "block";

    //applies the custom description from the parameter to the description field of the reusable input field window
    let popUpAdminValueText = document.getElementById("popUpAdminValueText");
    popUpAdminValueText.innerHTML = descriptionOfFeature;
}

/** Code that fetches the cancelNewValueButton button in the admin menu and adds the relevant function to it, in this case the button simply closes the admin input window */
document.getElementById("cancelNewValueButton").onclick = function () {
    closeNewValueContainerWindow();
}

/** The function "closeNewValueContainerWindow" simply gets and closes the currently open admin input window */
function closeNewValueContainerWindow() {
    document.getElementById("popUpAdminValue").style.display = "none";
    document.getElementById("popUpTicketValue").style.display = "none";
    resetNewAdminValue();
}

/** The function "resetNewAdminValue" resets the input values in the reusable admin input window to "" (nothing) */
function resetNewAdminValue() {
    document.getElementById("newValueContainerValue").value = "";
    document.getElementById("newTicketValueContainerValue").value = "";
    document.getElementById("newTicketDescriptionContainerValue").value = "";
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

export {enablePopUpWindow}
