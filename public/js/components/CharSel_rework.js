import React from 'react'
import GameBoardContainer from './Game_rework.js'
import WinScreen from './WinScreen.js'
import { addCard, unAddCard, changeGameState } from '../actions'
import { connect } from 'react-redux'

class CharacterTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
			selectedGlow: {}
        }
    }

	handleClick(e) {
		if (!this.state.isSelected) {
			if (!this.props.totalCards()) {
				console.log(this.props.card.name + " selected.");
				this.setState({
					isSelected: true,
					selectedGlow: {boxShadow: "0px 0px 30px #0f0"}
				});
				this.props.savec(this.props.card);
			} else {
				console.error("Max number of cards already selected!");
			}
		} else {
			console.log(this.props.card.name + " UNSELECTED!!!.");
			this.setState({
				isSelected: false,
				selectedGlow: {}
			});
			// Decrement the selected card count
			this.props.totalCards(true);

			this.props.unsavec(this.props.card);
		}
	}

	render() {
		return (
			<div className="characterTile" onClick={this.handleClick.bind(this)} style={this.state.selectedGlow}>
			<center>
				<p>{this.props.card.name}</p>
				<img src={"images/" + this.props.card.image} />
			</center>
			</div>
		);
	}
}

CharacterTile.propTypes = {
    card: React.PropTypes.object,
    savec: React.PropTypes.func,
    unsavec: React.PropTypes.func,
	// Whether the max number of cards have been selected
	totalCards: React.PropTypes.func
};

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
			<div style={{backgroundColor: "blue", width: "100%", height: "100%"}}>
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
				<button onClick={this.handleClick.bind(this)}> GO </button>
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

///////////////////////////////////////////////

class Rework extends React.Component {
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
			<div style={{width: "100%", height: "100%"}}>
				{content}
			</div>
		);
	}
}
Rework.propTypes = {
	gameState: React.PropTypes.string,
}


module.exports = Rework;