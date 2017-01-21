const initialState = {
    p1Cards: [],
    p2Cards: []
}

function cardApp(state = initialState, action) {
    switch (action.type) {
        case 'ADD_CARD': 
            let newCard = [action.card];
            return Object.assign({}, state, {p1Cards: state.p1Cards.concat(newCard)});
        default:
            return state;
    }
}

export default cardApp;