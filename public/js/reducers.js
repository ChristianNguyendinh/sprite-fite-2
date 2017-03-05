import cardsJSON from '../../cards.js'

const initialState = {
    availableCards: cardsJSON.cards,
    gameState: "pick",
    p1Cards: [],
    p2Cards: [],
    p1CardSelected: false,
    p2CardSelected: false,
    p1SpotSelected: false,
    p2SpotSelected: false,
}

function cardApp(state = initialState, action) {
    let newCardsArray = []
    let newGameState = ""
    let deaths = 0
    let avail = []

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
                "selected": false, // this may be different for the char select 'selected'
                "played": false,
                "dead": false
            };
            arr = arr.concat([newCard]);
            avail = state.availableCards.map(c => {
                if (c.name == action.card.name) {
                    c.selected = true
                }
                return c
            });

            if (state.p1Cards.length != 3)
                return Object.assign({}, state, {p1Cards: arr, availableCards: avail});
            else
                return Object.assign({}, state, {p2Cards: arr, availableCards: avail});
        case 'UNADD_CARD':
            // Remove the card from the player's selected card pile
            let newCards = state.p1Cards.filter(card => card.name != action.card.name);
            // add card to available pile
            avail = []
            avail = state.availableCards.map(c => {
                if (c.name == action.card.name) {
                    c.selected = false
                }
                return c
            });

            if (newCards.length < state.p1Cards.length) {
                return Object.assign({}, state, {p1Cards: newCards, availableCards: avail});
            } else {
                newCards = state.p2Cards.filter(card => card.name != action.card.name);
                if (newCards.length < state.p2Cards.length) 
                    return Object.assign({}, state, {p2Cards: newCards, availableCards: avail});
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
        case 'P1_ATTACK':
            /* REVERSED PLAYER BECAUSE PLAYER 1 IS ATTACKING PLAYER 2 */
            newCardsArray = state.p2Cards.map(card => {
                if (card.name == action.payload.cardName)
                    card.hp = String(action.payload.newHp)
                return card
            })
            return Object.assign({}, state, {p2Cards: newCardsArray});
        case 'P2_ATTACK':
            newCardsArray = state.p1Cards.map(card => {
                if (card.name == action.payload.cardName)
                    card.hp = String(action.payload.newHP)
                return card
            })
            return Object.assign({}, state, {p1Cards: newCardsArray});
        case 'P1_DEATH':
            deaths = 0
            newCardsArray = state.p1Cards.map(card => {
                if (card.dead)
                    deaths++
                if (card.name == action.cardName)
                    card.dead = true
                return card
            })
            if (deaths == 3)
                newGameState = "p2win"
            else 
                newGameState = state.gameState
                
            return Object.assign({}, state, {p1Cards: newCardsArray, gameState: newGameState});
        case 'P2_DEATH':
            deaths = 0
            newCardsArray = state.p2Cards.map(card => {
                if (card.dead == true)
                    deaths++
                if (card.name == action.cardName)
                    card.dead = true
                return card
            })
            // why is this three and not 2????
            if (deaths == 3)
                newGameState = "p1win"
            else 
                newGameState = state.gameState

            return Object.assign({}, state, {p2Cards: newCardsArray, gameState: newGameState});
        case 'UNSELECT':
            console.log("UNSELECT ASDF")
            return Object.assign({}, state, {
                p1CardSelected: false,
                p2CardSelected: false,
                p1SpotSelected: false,
                p2SpotSelected: false,
            });
        default:
            return state;
    }
}

export default cardApp;