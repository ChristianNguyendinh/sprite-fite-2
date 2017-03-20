import React from 'react'
import CharacterTile from './CharacterTile.js'
import { connect } from 'react-redux'

class CharacterSelect extends React.Component {
	constructor(props) {
		super(props);
		this.cardsSelected = 0;
	} 

	handleClick(e) {
		if (this.cardsSelected == 6) {
			socket.emit('change game state', "game");
			//this.props.changeGameState("game");
			console.log("changing game state");
		} else {
			// temp error message
			console.error("Each player needs to pick 3 cards!");
		}
	}

	// Return whether or not the max has been reached, and increment
	// or decrement the number of cards selected
	totalCardsSelected(unselect = false) {
		let returnValue = this.cardsSelected === 6;
		if (!returnValue && !unselect)
			this.cardsSelected++;
		if (unselect)
			this.cardsSelected--;
		
		return returnValue;
	}

	cardSave(card) {
		socket.emit('select card', card);
	}

	cardUnSave(card) {
		socket.emit('unselect card', card);
	}

	render() {
		return (
			<div style={{width: "100%", height: "100%"}}>
				<h1>Cards</h1>
				<div>
					<h3>P1 Cards</h3>
				</div>
				{this.props.availableCards.map(function(card, index) {
					return (
						<CharacterTile key={index} card={card} savec={this.cardSave} unsavec={this.cardUnSave} totalCards={this.totalCardsSelected.bind(this)}/>
					);
				}.bind(this))}
				<div>
					<h3>P2 Cards</h3>
				</div>
				<button style={{paddingBottom: "3%"}} onClick={this.handleClick.bind(this)}> GO </button>
			</div>
		);
	}
}

CharacterSelect.propTypes = {
    availableCards: React.PropTypes.array
};

const mapStateToProps = (state) => {
	return {
		availableCards: state.availableCards
	}
}

const CharacterSelectContainer = connect(
	mapStateToProps
)(CharacterSelect)

module.exports = CharacterSelectContainer;