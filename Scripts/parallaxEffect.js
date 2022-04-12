//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>
/** Relevant variables, constants and functions are imported in the "imports" section of the code, these are used by the relevant functions found below */

import {isMobile} from './onLoadFunctions.js'

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

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

//none