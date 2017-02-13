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
        type: 'P1_SPOT_SELECTED',
        p1SpotSelected: bool
    }
}

export const p2SpotSelected = (bool) => {
    return {
        type: 'P2_SPOT_SELECTED',
        p2SpotSelected: bool
    }
}

export const p1Attack = (name, hp) => {
    return {
        type: 'P1_ATTACK',
        payload: {
            cardName: name,
            newHp: hp 
        }
    }
}

export const p2Attack = (name, hp) => {
    return {
        type: 'P2_ATTACK',
        payload: {
            cardName: name,
            newHp: hp 
        }
    }
}

export const p1Death = (name) => {
    return {
        type: 'P1_DEATH',
        cardName: name
    }
}

export const p2Death = (name) => {
    return {
        type: 'P2_DEATH',
        cardName: name
    }
}

export const unselect = (bool) => {
    return {
        type: 'UNSELECT',
    }
}