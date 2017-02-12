const initialState = {
    gameState: "pick",
    p1Cards: [],
    p2Cards: [],
    p1CardSelected: false,
    p2CardSelected: false,
    p1SpotSelected: false,
    p2SpotSelected: false,
    p1ShowAttack: false,
    p2ShowAttack: false
}

/*
Click cards -> show available spots -> click spot -> place card on spot -> remove card from hand -> dont show available spots
Click spot -> if cards -> show available attacks -> if click spot avail for attack -> attack

Spot Click:
    Showing available? - place card
    Showing other player attack? - attack card
    Player card there? - show attack
    Else - do nothing

Spot Refresh:
    Showing player available? - glow blue
    Showing other player attack? - glow red
    Else - glow nothing

Card in hand click:
    If other player not showing available spots, Show available spots

*/

function cardApp(state = initialState, action) {
    switch (action.type) {
        case 'ADD_CARD': 
            // Change this for turn picking later
            let arr = state.p1Cards.length == 3 ? state.p2Cards : state.p1Cards;
            console.log(state.p1Cards.length == 3 ? "p2" : "p1");
            // Copy stats over to new card to use for battle
            let newCard = {
                "name" : action.card.name, 
                "image" : action.card.image,
                "hp" : action.card.hp,
                "atk" : action.card.atk,
                "selected": false,
                "played": false,
                "dead": false
            };
            arr = arr.concat([newCard]);
            if (state.p1Cards.length != 3)
                return Object.assign({}, state, {p1Cards: arr});
            else
                return Object.assign({}, state, {p2Cards: arr});
        case 'UNADD_CARD':
            // Remove the card from the player's selected card pile
            let newCards = state.p1Cards.filter(card => card.name != action.card.name);
            if (newCards.length < state.p1Cards.length) {
                return Object.assign({}, state, {p1Cards: newCards});
            } else {
                newCards = state.p2Cards.filter(card => card.name != action.card.name);
                if (newCards.length < state.p2Cards.length) 
                    return Object.assign({}, state, {p2Cards: newCards});
                else 
                    console.error("Something went terribly wrong trying to remove a card: Card not added")
            }
        case 'CHANGE_GAME_STATE':
            return Object.assign({}, state, {gameState: action.newGameState});
        case 'P1_CARD_SELECTED':
            return Object.assign({}, state, {p1CardSelected: action.p1CardSelected});
        case 'P2_CARD_SELECTED':
            return Object.assign({}, state, {p2CardSelected: action.p2CardSelected})
        case 'P1_SPOT_SELECTED':
            return Object.assign({}, state, {p1SpotSelected: action.p1SpotSelected});
        case 'P2_SPOT_SELECTED':
            return Object.assign({}, state, {p2SpotSelected: action.p2SpotSelected});  
        case 'P1_SHOW_ATTACK':
            return Object.assign({}, state, {p1ShowAttack: action.p1ShowAttack});
        case 'P2_SHOW_ATTACK':
            return Object.assign({}, state, {p2ShowAttack: action.p2ShowAttack});
        case 'UNSELECT':
            console.log("UNSELECT ASDF")
            return Object.assign({}, state, {
                p1CardSelected: false,
                p2CardSelected: false,
                p1SpotSelected: false,
                p2SpotSelected: false,
                p1ShowAttack: false,
                p2ShowAttack: false
            });
        default:
            return state;
    }
}

export default cardApp;