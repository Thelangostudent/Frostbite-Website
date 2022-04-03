
// all the cards
const card_container = document.getElementById('card-container');

// total number of cards
const total_number_of_cards = card_container.children.length - 1;

// the main card displaying out of all the cards in the deck which is the middle card
const middle_card = Math.floor(total_number_of_cards / 2);

// this is to prevent user spamming the next button so animation timing doesnt get messed up
let animation_in_progress = false;


// scale for making cards appear smaller and smaller the further away from the center card
let card_scale = 0.95;


/**
 order the cards where there are equal amount of cards on either side of the middle card
 */
function order_cards(card_width) {
    // how many cards left to the middle card which is the number of the middle card
    let counter_left = middle_card;

    // how many right to the middle card is not important, we just start the counter with 1
    let counter_right = 1;


    for (let i = 0; i <= total_number_of_cards; i++) {
        if (i < middle_card) {
            card_container.children[i].style.left = `-${(card_width + 10) * counter_left}vw`;

            // minus minus since we are moving to the "left"
            counter_left--;
            console.log("card moved to the left")
        } else if (i > middle_card) {

            card_container.children[i].style.left = `${(card_width + 10) * counter_right}vw`;

            // minus minus since we are moving to the "left"
            counter_right++;
            console.log("card moved to the right")

        } else  {
            card_container.children[i].style.left = `0px`;
        }
    }
}

export {order_cards, card_container};

/**
 * make the cards overlap a little to give it a stacking look like a deck of cards that is spread out
 */
/*function offset_cards() {
    // how many cards left to the middle card which is the number of the middle card
    let counter_left = middle_card;

    // how many right to the middle card is not important, we just start the counter with 1
    let counter_right = 1;


    for (let i = 0; i <= total_number_of_cards; i++) {
        let current_left = parseFloat(card_container.children[i].style.left);

        if (i < middle_card) {
            card_container.children[i].style.left = `${current_left + (card_offset * counter_left)}px`;
            counter_left--;
        } else if (i > middle_card) {
            card_container.children[i].style.left = `${current_left - (card_offset * counter_right)}px`;
            counter_right++;
        }
    }
}*/

/**
 * make the cards look smaller the farther away from the centre they are
 */
/*function scale_cards() {
    // how many cards left to the middle card which is the number of the middle card
    let counter_left = middle_card;

    // how many right to the middle card is not important, we just start the counter with 1
    let counter_right = 1;


    for (let i = 0; i <= total_number_of_cards; i++) {
        let current_left = parseFloat(card_container.children[i].style.left);

        if (i < middle_card) {
            card_container.children[i].style.transform = `scale(${Math.pow(card_scale, counter_left)})`;
            counter_left--;
        } else if (i > middle_card) {
            card_container.children[i].style.transform = `scale(${Math.pow(card_scale, counter_right)})`;
            counter_right++;
        } else {
            card_container.children[i].style.transform = `scale(1)`;
        }
    }
}*/


/**
 * make the cards have more depth by making them look like they are stacked upon each other, where middle card
 * is at the top and the rest are spread out like pyramid of cards looked from above
 */
/*function cascade_cards() {
    for (let i = 0; i <= total_number_of_cards; i++) {
        if (i <= middle_card) {
            card_container.children[i].style.zIndex = i;
        } else if (i > middle_card) {
            card_container.children[i].style.zIndex = -1.0 * i;
        }
    }
}*/

// order_cards();
// offset_cards();
// cascade_cards();
// scale_cards();


const next = document.getElementById('arrow-right')

next.addEventListener('click', ()=> {
    if (!animation_in_progress) {

        animation_in_progress = true;
        // the left of the last card in the deck (which is where the first card will appear during next card movement)
        let last_cards_left = card_container.children[total_number_of_cards].style.left;
        let last_card_zIndex = card_container.children[total_number_of_cards].style.zIndex;
        let last_card_transform = card_container.children[total_number_of_cards].style.transform;




        for (let i = total_number_of_cards; i > 0; i--) {

            // current card moves to the left and the rest to the left of current card do the same
            let card = card_container.children[i];
            let current_scale = card.style.transform; //parse scale out of 'transform'

            current_scale = current_scale.substring(current_scale.lastIndexOf('(') +1, current_scale.lastIndexOf(')'));
            current_scale = parseFloat(current_scale);

            card.style.transitionDuration = '1.0s';
            card.style.left = card_container.children[i - 1].style.left;
            card.style.transform = card_container.children[i - 1].style.transform;
            card.style.zIndex = card_container.children[i - 1].style.zIndex;



        }

        // special case of when the left-most card gets to moved to the far right

        card_container.children[0].style.transitionDuration = '0.2s'
        card_container.children[0].style.transform = `scale(0)`

        setTimeout(() => {
            card_container.children[0].style.zIndex = last_card_zIndex; //visual shift
            card_container.children[0].style.transitionDuration = '0.0s';
            card_container.children[0].style.left = last_cards_left; //visual shift

            card_container.append(card_container.children[0]); //DOM tree shift

            // when it disappears on the left (transform = `scale(0)`) it should pop out on the right
            setTimeout(() => {
                card_container.children[total_number_of_cards].style.transitionDuration = '0.3s'
                card_container.children[total_number_of_cards].style.transform = last_card_transform;


            }, 10)
            animation_in_progress = false;
        },700);
    }});

/**
 * logic for arriving at the next card of the current card active
 */
/*function next_card(){
    if (!animation_in_progress) {

        animation_in_progress = true;
        // the left of the last card in the deck (which is where the first card will appear during next card movement)
        const last_cards_left = card_container.children[total_number_of_cards].style.left;

        const last_card_transform = card_container.children[total_number_of_cards].style.transform;
        const last_card_zIndex = card_container.children[total_number_of_cards].style.zIndex;



        for (let i = total_number_of_cards; i > 0; i--) {

            // current card moves to the left and the rest to the left of current card do the same
            const card = card_container.children[i];
            card.style.transitionDuration = '1.0s';
            card.style.left = card_container.children[i - 1].style.left;
            card.style.transform = card_container.children[i - 1].style.transform;
            card.style.zIndex = card_container.children[i - 1].style.zIndex;



        }

        // special case of when the left-most card gets to moved to the far right

        card_container.children[0].style.transitionDuration = '0.2s'
        card_container.children[0].style.transform = `scale(0)`

        setTimeout(() => {
            card_container.children[0].style.left = last_cards_left; //visual shift
            card_container.children[0].style.zIndex = last_card_zIndex; //visual shift
            card_container.append(card_container.children[0]); //DOM tree shift

            // when it disappears on the left (transform = `scale(0)`) it should pop out on the right
            setTimeout(() => {
                card_container.children[total_number_of_cards].style.transitionDuration = '0.3s'
                card_container.children[total_number_of_cards].style.transform = last_card_transform;

                animation_in_progress = false;
            }, 10)
        },700)
    }
}*/

/**
 * logic for arriving at the previous card of the current card that is active
 */
function previous_card(){
    if (!animation_in_progress) {

        animation_in_progress = true;
        // the left of the last card in the deck (which is where the first card will appear during next card movement)
        const first_cards_left = card_container.children[0].style.left;

        const first_card_transform = card_container.children[0].style.transform;
        const first_card_zIndex = card_container.children[0].style.zIndex;

        for (let i = 0; i < total_number_of_cards; i++) {

            // current card moves to the left and the rest to the left of current card do the same
            const card = card_container.children[i];
            card.style.transitionDuration = '1.0s';
            card.style.left = card_container.children[i + 1].style.left;
            card.style.transform = card_container.children[i + 1].style.transform;
            card.style.zIndex = card_container.children[i + 1].style.zIndex;


        }

        // special case of when the left-most card gets to moved to the far right

        card_container.children[total_number_of_cards].style.transitionDuration = '0.2s'
        card_container.children[total_number_of_cards].style.transform = `scale(0)`

        setTimeout(() => {
            card_container.children[total_number_of_cards].style.left = first_cards_left; //visual shift
            card_container.children[total_number_of_cards].style.zIndex = first_card_zIndex;
            card_container.insertBefore(card_container.children[total_number_of_cards], card_container.children[0]); //DOM tree shift

            // when it disappears on the left (transform = `scale(0)`) it should pop out on the right
            setTimeout(() => {
                card_container.children[0].style.transitionDuration = '0.3s'
                card_container.children[0].style.transform = first_card_transform;

                animation_in_progress = false;
            }, 10)
        },700)
    }
}