/*
* Actions for redux
*/

export const addCard = (card, player) => {
    return {
        type: 'ADD_CARD',
        card
    }
}