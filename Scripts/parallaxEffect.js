//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {isMobile} from './onLoadFunctions.js'

//<----------------------------------------------------- PARALLAX EFFECT --------------------------------------------------------------------------------------------->

/** The parallax function has the main responsibility to assure a smooth and unique scrolling effect on the website by using a multi-layered design that gives
    the visitor an illusion of depth. The parallax effect is only enabled on computers, not mobiles, due to potential performance issues on older phones.
    This makes the website accessible and friendly to as many platforms and devices as possible. The function mainly makes the background image scroll slower than the rest
    of the page using a mathematical offset defined in the Y-value constant */
document.getElementById("body").onscroll = function para() {
    //checks if the device is not a mobile
    if (isMobile === false) {
        const scrolltotop = document.scrollingElement.scrollTop;
        const target = document.getElementById("backgroundPara");
        const xvalue = "center";
        const factor = 0.5;

        //gets the windowWidth and innerWidth of the users device and calculates the offset accordingly
        const windowWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const yvalue = (windowWidth * 0.040) + (scrolltotop * factor);

        //applies the new offset to the first layer of the website (the background image)
        target.style.backgroundPosition = xvalue + " " + yvalue + "px";
    }
}

/** The fixImage function is activated everytime the user resizes the window, this is because the mathematical offset is based on the clientWidth to the users device,
 and when the window is resized, so is the clientWidth. By activating this function whenever the window is resized, the parallax effect will recalculate its offset
 and display the layers accordingly, this makes the parallax effect suitable for all window sizes */
window.onresize = function fixImage() {
    if (isMobile === false) {
        const doc = document.documentElement;

        //applies the new offset
        const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        window.scroll(left + 1, top + 1);
    }
}

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

//none