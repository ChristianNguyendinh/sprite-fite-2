import React from 'react'
import cardsJSON from '../../../cards.js'

// These will live on the server eventually. Leave them as global vars for now for ease of testing
var p1Cards = [];
var p2Cards = [];

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
			// Don't add if each player has already picked three cards
			if (p1Cards.length != 3 || p2Cards.length != 3) {
				console.log(this.props.card.name + " selected.");
				this.setState({
					isSelected: true,
					selectedGlow: {boxShadow: "0px 0px 30px #0f0"}
				}, this.sendCard.bind(this));
			}
		} else {
			console.log(this.props.card.name + " UNSELECTED!!!.");
			this.setState({
				isSelected: false,
				selectedGlow: {}
			}, this.sendCard.bind(this));
		}
	}

	sendCard() {
		let player = p1Cards.length != 3 ? "p1" : "p2";
		if (this.state.isSelected) {
			this.props.savec(this.props.card, player);
		} else {
			this.props.unsavec(this.props.card, player);
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
    unsavec: React.PropTypes.func
};

class CharacterSelect extends React.Component {

	saveCard(card, player) {
		let arr = player == "p1" ? p1Cards : p2Cards;
		// Copy stats over to new card to use for battle
		let newCard = {
			"name" : card.name, 
			"image" : card.image,
			"hp" : card.hp,
			"atk" : card.atk,
			"played": false,
			"dead": false
		};
		arr.push(newCard);
	}

	unsaveCard(card) {
		// Remove the card from the player's selected card pile
		for (let i = 0; i < p1Cards.length; i++) {
			if (p1Cards[i].name == card.name) {
				p1Cards.splice(i, 1);
				return;
			}
		}
		for (let i = 0; i < p2Cards.length; i++) {
			if (p2Cards[i].name == card.name) {
				p2Cards.splice(i, 1);
				return;
			}
		}
	}

	handleClick(e) {
		if (p1Cards.length == 3 && p2Cards.length == 3) {
			this.props.changeGameState("game");
		} else {
			// temp error message
			console.error("Each player needs to pick 3 cards!");
		}
	}

	render() {
		return (
			<div style={{backgroundColor: "blue", width: "100%", height: "100%"}}>
				<h1>Cards</h1>
				<div>
					<h3>P1 Cards</h3>
				</div>
				{cardsJSON['cards'].map(function(card, index) {
					return (
						<CharacterTile key={index} card={card} savec={this.saveCard} unsavec={this.unsaveCard}/>
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
    changeGameState: React.PropTypes.func
};


///////////////////////////////////////////////

class Rework extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// pick, game, p1win, or p2win
			gameState: "pick"
		}
	}

	changeGameState(newState) {
		console.log("Chaning game state to: " + newState);
		this.setState({
			gameState: newState
		});
	}

	render() {
		var content;
		if (this.state.gameState == "pick")
			content = <CharacterSelect changeGameState={this.changeGameState.bind(this)}/>;
		else
			content = null;

		return (
			<div style={{width: "100%", height: "100%"}}>
				{content}
			</div>
		);
	}
}

module.exports = Rework;