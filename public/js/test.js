import React from 'react';
import ReactDOM from 'react-dom';
import GameContainer from './components/GameContainer';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import cardApp from './reducers';

let store = createStore(
    cardApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
    console.log("State Changed: ", store.getState());
});

//store.dispatch({type: "ADD_CARD", card: "monster"});
//store.dispatch({type: "ADD_CARD", card: "poo"});

socket.on('reply', (resp) => {
    console.log('reply: ' + resp);
    store.dispatch({type: ""});
});

ReactDOM.render(
    <Provider store = {store}>
        <GameContainer />
    </Provider>, 
    document.getElementById('main'));