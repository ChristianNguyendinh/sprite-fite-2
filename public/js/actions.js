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

export const p1CardSelected = (bool) => {
    return {
        type: 'P1_CARD_SELECTED',
        p1CardSelected: bool
    }
}

export const p2CardSelected = (bool) => {
    return {
        type: 'P2_CARD_SELECTED',
        p2CardSelected: bool
    }
}

export const p1SpotSelected = (bool) => {
    return {
        type: 'P1_CARD_SELECTED',
        p1CardSelected: bool
    }
}

export const p2SpotSelected = (bool) => {
    return {
        type: 'P2_CARD_SELECTED',
        p2CardSelected: bool
    }
}

export const p1ShowAttack = (bool) => {
    return {
        type: 'P1_SHOW_ATTACK',
        p1ShowAttack: bool
    }
}

export const p2ShowAttack = (bool) => {
    return {
        type: 'P2_SHOW_ATTACK',
        p2ShowAttack: bool
    }
}

export const unselect = (bool) => {
    return {
        type: 'UNSELECT',
    }
}