import React from 'react'
import ReactDOM from 'react-dom'
import Rework from './components/CharSel_rework'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import cardApp from './reducers'

let store = createStore(cardApp);

store.subscribe(() => {
    console.log("State Changed: ", store.getState());
});

store.dispatch({type: "ADD_CARD", card: "monster"});
store.dispatch({type: "ADD_CARD", card: "poo"});


ReactDOM.render(
    <Provider store = {store}>
        <Rework />
    </Provider>, 
    document.getElementById('main'));