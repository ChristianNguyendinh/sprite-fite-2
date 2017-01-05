var React = require('react');
var cardsJSON = require('../../../cards.json');

var tempCards = [{
			"name" : "AverageJoe", 
			"image" : "AverageJoe.jpg",
			"hp" : "10",
			"atk" : "11"
		},
		{
			"name" : "Macho-Macho", 
			"image" : "BC_Macho-Macho.jpg",
			"hp" : "40",
			"atk" : "21"
		},
		{
			"name" : "Clown1", 
			"image" : "Clown1.jpg",
			"hp" : "2",
			"atk" : "52"
		}];

p1Cards = [];
p2Cards = [];

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
			"played": false
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

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var Card = React.createClass({
	propTypes: {
		card: React.PropTypes.object,
		player: React.PropTypes.string,
		showAvailable: React.PropTypes.func,
		otherSelected: React.PropTypes.bool
	},
	getInitialState: function() {
		return {
			isSelected: false,
			selectedGlow: "none"
		};
	},
	handleClick: function(e) {
		if (!this.state.isSelected && !this.props.otherSelected) {
			//console.log(this.props.cardName + " selected.");
			this.setState({
				isSelected: true,
				selectedGlow: "0px 0px 30px #0f0"
			}, this.getSpots);
		} else {
			//console.log(this.props.cardName + " UNSELECTED.");
			if (this.state.isSelected) {
				this.setState({
					isSelected: false,
					selectedGlow: "none"
				}, this.getSpots);
			}
		}
	},
	getSpots: function() {
		if (this.props.showAvailable) {
			this.props.showAvailable(this.state.isSelected, this.props.player, this.props.card);
		} else {
			console.log("Something went wrong showing avail");
		}
	},
	render: function() {
		if (this.props.card.played)
			return null; // TODO: Make placing down a card unselect
		return (
			<div onClick={this.handleClick} style={{backgroundColor: "red", width: "10%", height: "15%", display:"inline-block", margin: "5px", float: "left", boxShadow: this.state.selectedGlow}}>
			<center>
				<p style={{margin: "0px"}}>{this.props.card ? this.props.card.name : "NULL"}</p>
				<img src={this.props.card ? "images/" + this.props.card.image : ""} style={{width: "75%", display: "block"}}/>
				<p style={{margin: "0px", float: "left"}}>{this.props.card ? this.props.card.hp : ""}</p>
				<p style={{margin: "0px", float: "right"}}>{this.props.card ? this.props.card.atk : ""}</p>
			</center>
			</div>
		);
	}
});

var CardSpot = React.createClass({
	propTypes: {
		player: React.PropTypes.string,
		showGlow: React.PropTypes.bool,
		showTarget: React.PropTypes.bool,
		cardToPlace: React.PropTypes.object,
		getTarget: React.PropTypes.func,
	},
	getInitialState: function() {
		return {
			filled: false,
			card: null,
			selected: false
		};
	},
	handleClick: function(e) {
		if (this.props.showGlow && !this.state.filled) {
			this.props.cardToPlace.played = true;
			this.setState({
				filled: true,
				card: this.props.cardToPlace ? this.props.cardToPlace : null,
				selected: false,
			});
		} else if (!this.props.showGlow && this.state.filled && !this.props.showTarget) {
			this.setState({
				filled: true,
				card: this.state.card,
				selected: !this.state.selected,
			}, this.getTargets);
			console.log(this.props.showTarget);
		} else if (!this.props.showGlow && this.state.filled && this.props.showTarget) {
			this.attack();
		}
	},
	getTargets: function() {
		if (this.props.getTarget) {
			this.props.getTarget(this.props.player, this.state.card, this.unselect);
		}
	},
	attack: function() {
		if (this.props.executeAttack) {
			this.props.executeAttack(this.state.card);
		}
	},
	unselect: function() {
		this.setState({
			filled: this.state.filled,
			card: this.state.card,
			selected: false,
		});
	},
	render: function() {
		var shadow;
		if (this.props.showGlow && !this.state.filled && !this.props.showTarget) {
			shadow = "0px 0px 30px #00f";
		} else if (!this.props.showGlow && this.state.filled && this.state.selected) {
			shadow = "0px 0px 30px #0f0";
		} else if (this.props.showTarget) {
			shadow = "0px 0px 30px #f00";
		} else {
			shadow = "none";
		}
		return (
			<div onClick={this.handleClick} style={{border: "1px solid black", width: "14%", height: "100%", marginLeft: "5%", display: "inline-block", boxShadow: shadow, verticalAlign: "top"}}>
			<center>
				<span style={{margin: "0px"}}>{this.state.card ? this.state.card.name : ""}</span>
				<img src={this.state.card ? "images/" + this.state.card.image : "images/white.jpg"} style={{width: "75%"}}/>
				<div>
					<span style={{margin: "0px", float: "left"}}>{this.state.card ? this.state.card.hp : ""}</span>
					<span style={{margin: "0px", float: "right"}}>{this.state.card ? this.state.card.atk : ""}</span>
				</div>
			</center>
			</div>
		);
	}
});

var GameBoard = React.createClass({
	getInitialState: function() {
		return {
			p1CardSelected: false,
			p2CardSelected: false,
			p1SpotSelected: false,
			p2SpotSelected: false,
			cardSelected: null,
			attacker: null, 
			helperFunc: null,
		};
	},
	showSpots: function(selected, player, card) {
		let c = selected ? card : null;
		if (player == "p1") {
			this.setState({
				p1CardSelected: selected,
				p2CardSelected: this.state.p2CardSelected,
				p1SpotSelected: this.state.p1SpotSelected,
				p2SpotSelected: this.state.p2SpotSelected,
				cardSelected: c,
				attacker: null,
				helperFunc: null,
			});
		} else if (player == "p2") {
			this.setState({
				p1CardSelected: this.state.p1CardSelected,
				p2CardSelected: selected,
				p1SpotSelected: this.state.p1SpotSelected,
				p2SpotSelected: this.state.p2SpotSelected,
				cardSelected: c,
				attacker: null,
				helperFunc: null,
			});
		} else {
			console.log("Error showing cards for " + player);
		}
		console.log("card selected: " + c);
	},
	showTargets: function(player, card, unselectFunc) {
		if (player == "p1") {
			this.setState({
				p1CardSelected: this.state.p1CardSelected,
				p2CardSelected: this.state.p2CardSelected,
				p1SpotSelected: !this.state.p1SpotSelected,
				p2SpotSelected: this.state.p2SpotSelected,
				cardSelected: this.state.cardSelected,
				attacker: !this.state.p1SpotSelected ? card : null,
				helperFunc: unselectFunc,
			});
		} else if (player == "p2") {
			this.setState({
				p1CardSelected: this.state.p1CardSelected,
				p2CardSelected: this.state.p2CardSelected,
				p1SpotSelected: this.state.p1SpotSelected,
				p2SpotSelected: !this.state.p2SpotSelected,
				cardSelected: this.state.cardSelected,
				attacker: !this.state.p2SpotSelected ? card : null,
				helperFunc: unselectFunc,
			});
		} else {
			console.log("Error showing cards for " + player);
		}
	},
	attack: function(card) {
		if (this.state.attacker) {
			console.log(this.state.attacker.name + " is attacking " + card.name + " for DMG: " + this.state.attacker.atk);
			card.hp -= this.state.attacker.atk;
			// unselect to reset
			this.state.helperFunc();
			// reset for next turn
			this.setState({
				p1CardSelected: false,
				p2CardSelected: false,
				p1SpotSelected: false,
				p2SpotSelected: false,
				cardSelected: null,
				attacker: null,
				helperFunc: null,
			});
		} else {
			console.log("No attacker Error!");
		}
	},
	render: function() {
		return (
			<div style={{backgroundColor: "white", width: "100%", height: "100%", padding: "5% 8%"}}>
				<Card card={p1Cards[0]} otherSelected={this.state.p1CardSelected} showAvailable={this.showSpots} player={"p1"}/>
				<Card card={p1Cards[1]} otherSelected={this.state.p1CardSelected} showAvailable={this.showSpots} player={"p1"}/>
				<Card card={p1Cards[2]} otherSelected={this.state.p1CardSelected} showAvailable={this.showSpots} player={"p1"}/>

				<div style={{border: "1px dashed red", width: "90%", height: "70%", position: "relative", clear: "both"}}>
					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p1CardSelected} getTarget={this.showTargets} showTarget={this.state.p2SpotSelected} executeAttack={this.attack} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p1CardSelected} getTarget={this.showTargets} showTarget={this.state.p2SpotSelected} executeAttack={this.attack} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p1CardSelected} getTarget={this.showTargets} showTarget={this.state.p2SpotSelected} executeAttack={this.attack} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p1CardSelected} getTarget={this.showTargets} showTarget={this.state.p2SpotSelected} executeAttack={this.attack} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p1CardSelected} getTarget={this.showTargets} showTarget={this.state.p2SpotSelected} executeAttack={this.attack} player={"p1"}/>
						</div>
					</div>

					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute", bottom: "0px"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p2CardSelected} getTarget={this.showTargets} showTarget={this.state.p1SpotSelected} executeAttack={this.attack} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p2CardSelected} getTarget={this.showTargets} showTarget={this.state.p1SpotSelected} executeAttack={this.attack} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p2CardSelected} getTarget={this.showTargets} showTarget={this.state.p1SpotSelected} executeAttack={this.attack} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p2CardSelected} getTarget={this.showTargets} showTarget={this.state.p1SpotSelected} executeAttack={this.attack} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.state.p2CardSelected} getTarget={this.showTargets} showTarget={this.state.p1SpotSelected} executeAttack={this.attack} player={"p2"} />
						</div>
					</div>
				</div>

				<Card card={p2Cards[0]} otherSelected={this.state.p2CardSelected} showAvailable={this.showSpots} player={"p2"}/>
				<Card card={p2Cards[1]} otherSelected={this.state.p2CardSelected} showAvailable={this.showSpots} player={"p2"}/>
				<Card card={p2Cards[2]} otherSelected={this.state.p2CardSelected} showAvailable={this.showSpots} player={"p2"}/>

			</div>
		);
	}
});

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var App = React.createClass({
	getInitialState: function() {
		return {
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
		return (
			<div style={{width: "100%", height: "100%"}}>
				{this.state.gameState == "pick" ? (
					<CharacterSelect changeGameState={this.changeGameState}/>
				) : (
					<GameBoard />
				)}
			</div>
		);
	}
});

module.exports = App;
