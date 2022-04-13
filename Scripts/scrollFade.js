//<----------------------------------------------------------- IMPORTS ------------------------------------------------------------------------------------------>

//none

//<-------------------------------------------------------- PARALLAX EFFECT ------------------------------------------------------------------------------------->

//gets all elements marked with the scrollFade class
const fadeElements = document.getElementsByClassName('scrollFade');

/** The scrollFade function is a function that hides/shows content in the main container as the user scrolls down the page, the element is by default hidden, but when scrolled
 into view, a short fade animation will be activated to display the item, this gives the website extra depth and quality. The main animation is defined in the CSS file as "scrollFade"
 *  The scrollFade effect is adapted from Jordan Trbuhovics (meddlenz) open source github example found here "https://github.com/meddlenz/ScrollFade" */
function scrollFade() {
    for (let index = 0; index < fadeElements.length; index++) {
        const element = fadeElements[index];
        const rect = element.getBoundingClientRect();

        //defines the fade in point, when the animation is activated and the element is shown
        const elementFourth = rect.height / 4;
        const fadeInPoint = window.innerHeight - elementFourth;
        if (rect.top <= fadeInPoint) {
            //shows elements in the main container via a fade animation when the user is scrolling down
            element.classList.add('scrollFade--visible');
            element.classList.add('scrollFade--animate');
            element.classList.remove('scrollFade--hidden');
        } else {
            //hides elements below the visible content if the user scrolls back up
            element.classList.remove('scrollFade--visible');
            element.classList.add('scrollFade--hidden');
        }
    }
}

//adds eventListeners to the scrollFade effect
document.addEventListener('scroll', scrollFade);
window.addEventListener('resize', scrollFade);
document.addEventListener('DOMContentLoaded', function () {
    scrollFade();
});

//<----------------------------------------------------------- EXPORTS ------------------------------------------------------------------------------------------>

//none