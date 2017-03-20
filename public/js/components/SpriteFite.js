import React from 'react'
import GameBoardContainer from './Game/GameBoard.js'
import CharacterSelectContainer from './CharacterSelect/CharacterSelect.js'
import WinScreen from './EndGame/WinScreen.js'
import { addCard, unAddCard, changeGameState } from '../actions'
import { connect } from 'react-redux'

class SpriteFite extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var content;
		if (this.props.gameState == "pick")
			content = <CharacterSelectContainer />;
		else if (this.props.gameState == "game")
			content = <GameBoardContainer />;
		else if (this.props.gameState == "p1win")
			content = <WinScreen player="p1" />
		else if (this.props.gameState == "p2win")
			content = <WinScreen player="p2" />
		else
			content = null;

		return (
			<div id="sprite-fite-div">
				{content}
			</div>
		);
	}
}
SpriteFite.propTypes = {
	gameState: React.PropTypes.string,
}


module.exports = SpriteFite;