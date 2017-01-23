/*
* Actions for redux
*/

export const addCard = (card, player) => {
    return {
        type: 'ADD_CARD',
        card: card
    }
}

export const unAddCard = (card) => {
    return {
        type: 'UNADD_CARD',
        card: card
    }
}

export const changeGameState = (newGameState) => {
    return {
        type: 'CHANGE_GAME_STATE',
        newGameState: newGameState
    }
}