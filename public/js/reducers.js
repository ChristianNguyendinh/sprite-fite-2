const initialState = {
    p1Cards: [],
    p2Cards: []
}

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
        default:
            return state;
    }
}

export default cardApp;