// LETS CONVERT THIS TO ES6 NOW!

var React = require('react');
var cardsJSON = require('../../../cards.json');

// These will live on the server eventually. Leave them as global vars for now for ease of testing
var p1Cards = [];
var p2Cards = [];

var CharacterTile = React.createClass({
	propTypes: {
		card: React.PropTypes.object,
		savec: React.PropTypes.func,
		unsavec: React.PropTypes.func
	},
	getInitialState: function() {
		return {
			isSelected: false,
			selectedGlow: {}
		};
	},
	handleClick: function(e) {
		if (!this.state.isSelected) {
			// Don't add if each player has already picked three cards
			if (p1Cards.length != 3 || p2Cards.length != 3) {
				console.log(this.props.card.name + " selected.");
				this.setState({
					isSelected: true,
					selectedGlow: {boxShadow: "0px 0px 30px #0f0"}
				}, this.sendCard);
			}
		} else {
			console.log(this.props.card.name + " UNSELECTED.");
			this.setState({
				isSelected: false,
				selectedGlow: {}
			}, this.sendCard);
		}
	},
	sendCard: function() {
		let player = p1Cards.length != 3 ? "p1" : "p2";
		if (this.state.isSelected) {
			this.props.savec(this.props.card, player);
		} else {
			this.props.unsavec(this.props.card, player);
		}
	},
	render: function() {
		return (
			<div className="characterTile" onClick={this.handleClick} style={this.state.selectedGlow}>
			<center>
				<p>{this.props.card.name}</p>
				<img src={"images/" + this.props.card.image} />
			</center>
			</div>
		);
	}
});

var CharacterSelect = React.createClass({
	propTypes: {
		changeGameState: React.PropTypes.func
	},
	saveCard: function(card, player) {
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
	},
	unsaveCard: function(card) {
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
	},
	handleClick: function() {
		if (p1Cards.length == 3 && p2Cards.length == 3) {
			this.props.changeGameState("game");
		} else {
			// temp error message
			console.error("Each player needs to pick 3 cards!");
		}
	},
	render: function() {
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
				<button onClick={this.handleClick}> GO </button>
			</div>
		);
	}
});


///////////////////////////////////////////////


var Rework = React.createClass({
	getInitialState: function() {
		return {
			// pick, game, p1win, or p2win
			gameState: "pick"
		};
	},
	changeGameState: function(newState) {
		console.log("Chaning game state to: " + newState);
		this.setState({
			gameState: newState
		});
	},
	render: function() {
		var content
		if (this.state.gameState == "pick")
			content = <CharacterSelect changeGameState={this.changeGameState}/>;
		else if (this.state.gameState == "game")
			content = <GameBoard changeGameState={this.changeGameState}/>;
		else
			content = null;

		return (
			<div style={{width: "100%", height: "100%"}}>
				{content}
			</div>
		);
	}
});

module.exports = Rework;