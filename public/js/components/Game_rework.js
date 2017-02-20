import React from 'react';
import { connect } from 'react-redux'
import { changeGameState, p1CardSelected, p2CardSelected, p1SpotSelected, p2SpotSelected, p1Attack, p2Attack, p1Death, p2Death, unselect } from '../actions'

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
			selectedGlow: "none"
        }
    }

	handleClick(e) {
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
		socket.emit('test', "some test data");
	}

	getSpots() {
		if (this.props.showAvailable) 
			this.props.showAvailable(this.state.isSelected, this.props.player, this.props.card);
		else 
			console.log("Something went wrong showing avail");
	}

	render() {
		if (this.props.card.played || this.props.card.dead)
			return null; // TODO: Make placing down a card unselect
		return (
			<div onClick={this.handleClick.bind(this)} style={{backgroundColor: "red", width: "10%", height: "15%", display:"inline-block", margin: "5px", float: "left", boxShadow: this.state.selectedGlow}}>
			<center>
				<p style={{margin: "0px"}}>{this.props.card ? this.props.card.name : "NULL"}</p>
				<img src={this.props.card ? "images/" + this.props.card.image : ""} style={{width: "75%", display: "block"}}/>
				<p style={{margin: "0px", float: "left"}}>{this.props.card ? this.props.card.hp : ""}</p>
				<p style={{margin: "0px", float: "right"}}>{this.props.card ? this.props.card.atk : ""}</p>
			</center>
			</div>
		);
	}
}
Card.PropTypes = {
    card: React.PropTypes.object,
    player: React.PropTypes.string,
    showAvailable: React.PropTypes.func,
    otherSelected: React.PropTypes.bool
}

//////////////////////////////

class CardSpot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filled: false,
			card: null,
			selected: false
        }
    }

	handleClick(e) {
		// Picking a spot for a card
		if (this.props.showGlow && !this.state.filled) {
			this.props.cardToPlace.played = true;
			this.setState({
				filled: true,
				card: this.props.cardToPlace || null,
				selected: false,
			});
		// Selecting a spot with the card in it
		} else if (!this.props.showGlow && this.state.filled && !this.props.showTarget) {
			this.setState({
				filled: true,
				card: this.state.card,
				selected: !this.state.selected,
			}, this.getTargets.bind(this));
		// Selecting a spot for attack
		} else if (!this.props.showGlow && this.state.filled && this.props.showTarget) {
			this.attack();
		}
	}

	getTargets() {
		if (this.props.getTarget) {
			this.props.getTarget(this.props.player, this.state.card, this.state.selected);
		}
	}

	attack() {
		if (this.props.executeAttack) {
			this.props.executeAttack(this.state.card, this.props.player);
		}
	}

	/* DOES NOT WORK. because attack is called by the card BEING attacked, not the attacker!
	unselect() {
		console.log("UNSELECTING")
		this.setState({
			filled: this.state.filled,
			card: this.state.card,
			selected: false,
		});
	}
	*/

	render() {
		var shadow;
		if (this.props.showGlow && !this.state.filled && !this.props.showTarget) {
			shadow = "0px 0px 30px #00f"
		} else if (!this.props.showGlow && this.state.filled && this.state.selected) {
			shadow = "0px 0px 30px #0f0"
		} else if (this.props.showTarget && this.state.filled) {
			shadow = "0px 0px 30px #f00"
		} else {
			shadow = "none";
		}
		var img = this.state.card && this.state.card.dead ? "images/red.jpg" : "images/white.jpg"
		return (
			<div onClick={this.handleClick.bind(this)} style={{border: "1px solid black", width: "14%", height: "100%", marginLeft: "5%", display: "inline-block", boxShadow: shadow, verticalAlign: "top"}}>
			<center>
				<span style={{margin: "0px"}}>{this.state.card && !this.state.card.dead ? this.state.card.name : ""}</span>
				<img src={this.state.card && !this.state.card.dead ? "images/" + this.state.card.image : img} style={{width: "75%"}}/>
				<div>
					<span style={{margin: "0px", float: "left"}}>{this.state.card && !this.state.card.dead ? this.state.card.hp : ""}</span>
					<span style={{margin: "0px", float: "right"}}>{this.state.card && !this.state.card.dead ? this.state.card.atk : ""}</span>
				</div>
			</center>
			</div>
		);
	}
}
CardSpot.propTypes = {
    player: React.PropTypes.string,
    showGlow: React.PropTypes.bool,
    showTarget: React.PropTypes.bool,
    cardToPlace: React.PropTypes.object,
    getTarget: React.PropTypes.func,
}

//////////////////////////////////////////////////////

class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			cardSelected: null,
			attacker: null, 
        }
    }

	showSpots(selected, player, card) {
		let c = selected ? card : null;
		if (player == "p1") {
			this.setState({
				cardSelected: c,
				attacker: null,
			});
			this.props.p1CardFunc(selected ? true : false);
		} else if (player == "p2") {
			this.setState({
				cardSelected: c,
				attacker: null,
			});
			this.props.p2CardFunc(selected ? true : false);
		} else {
			console.log("Error showing cards for " + player);
		}
		console.log("card selected: " + selected);
	}

	showTargets(player, card, selected) {
		if (player == "p1") {
			this.setState({
				cardSelected: this.state.cardSelected,
				attacker: !this.props.p1SpotSelected ? card : null,
			});
			this.props.p1SpotFunc(selected ? true : false);
		} else if (player == "p2") {
			this.setState({
				cardSelected: this.state.cardSelected,
				attacker: !this.props.p2SpotSelected ? card : null,
			});
			this.props.p2SpotFunc(selected ? true : false);
		} else {
			console.log("Error showing cards for " + player);
		}
	}

	attack(card, player) {
		if (this.state.attacker) {
			console.log(this.state.attacker.name + " is attacking " + card.name + " for DMG: " + this.state.attacker.atk);
			card.hp -= this.state.attacker.atk;
			if (card.hp <= 0) {
				card.dead = true;
				if (player == "p1")
					this.props.p1DeathFunc(card.name)
				else 
					this.props.p2DeathFunc(card.name)

			} else {
				/* Reversed because the 'player' is being attacked */
				if (player == "p1")
					this.props.p2AttackingFunc(card.name, card.hp)
				else
					this.props.p1AttackingFunc(card.name, card.hp)
			}
			// reset for next turn
			this.setState({
				cardSelected: null,
				attacker: null,
			});
			// Reset state
			this.props.unselect();
		} else {
			console.log("No attacker Error!");
		}
	}

	render() {
		return (
			<div style={{backgroundColor: "white", width: "100%", height: "100%", padding: "5% 8%"}}>
				<Card card={this.props.p1Cards[0]} otherSelected={this.props.p1CardSelected} showAvailable={this.showSpots.bind(this)} player={"p1"}/>
				<Card card={this.props.p1Cards[1]} otherSelected={this.props.p1CardSelected} showAvailable={this.showSpots.bind(this)} player={"p1"}/>
				<Card card={this.props.p1Cards[2]} otherSelected={this.props.p1CardSelected} showAvailable={this.showSpots.bind(this)} player={"p1"}/>

				<div style={{border: "1px dashed red", width: "90%", height: "70%", position: "relative", clear: "both"}}>
					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
						</div>
					</div>

					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute", bottom: "0px"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
						</div>
					</div>
				</div>

				<Card card={this.props.p2Cards[0]} otherSelected={this.props.p2CardSelected} showAvailable={this.showSpots.bind(this)} player={"p2"}/>
				<Card card={this.props.p2Cards[1]} otherSelected={this.props.p2CardSelected} showAvailable={this.showSpots.bind(this)} player={"p2"}/>
				<Card card={this.props.p2Cards[2]} otherSelected={this.props.p2CardSelected} showAvailable={this.showSpots.bind(this)} player={"p2"}/>

			</div>
		);
	}
}
GameBoard.propTypes = {
	p1Cards: React.PropTypes.array,
	p2Cards: React.PropTypes.array,
	p1CardSelected: React.PropTypes.bool,
	p2CardSelected: React.PropTypes.bool,
	p1SpotSelected: React.PropTypes.bool,
	p2SpotSelected: React.PropTypes.bool,
	changeGameState: React.PropTypes.func,
	p1CardFunc: React.PropTypes.func,
	p2CardFunc: React.PropTypes.func,
	p1SpotFunc: React.PropTypes.func,
	p2SpotFunc: React.PropTypes.func,
	p1AttackingFunc: React.PropTypes.func,
	p2AttackingFunc: React.PropTypes.func,
	p1DeathFunc: React.PropTypes.func,
	p2DeathFunc: React.PropTypes.func,
	unselect: React.PropTypes.func
}

/// containers ////////////
const mapStateToProps = (state) => {
    return {
		p1Cards: state.p1Cards,
		p2Cards: state.p2Cards,
		p1CardSelected: state.p1CardSelected,
		p2CardSelected: state.p2CardSelected,
		p1SpotSelected: state.p1SpotSelected,
		p2SpotSelected: state.p2SpotSelected,
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeGameState: (newGameState) => {
			dispatch(changeGameState(newGameState))
		},
		p1CardFunc: (bool) => {
			dispatch(p1CardSelected(bool))
		},
		p2CardFunc: (bool) => {
			dispatch(p2CardSelected(bool))
		},
		p1SpotFunc: (bool) => {
			dispatch(p1SpotSelected(bool))
		},
		p2SpotFunc: (bool) => {
			dispatch(p2SpotSelected(bool))
		},
		p1AttackingFunc: (name, hp) => {
			dispatch(p1Attack(name, hp))
		},
		p2AttackingFunc: (name, hp) => {
			dispatch(p2Attack(name, hp))
		},
		p1DeathFunc: (name) => {
			dispatch(p1Death(name))
		},
		p2DeathFunc: (name) => {
			dispatch(p2Death(name))
		},
		unselect: () => {
			dispatch(unselect())
		}
	}
}

const GameBoardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameBoard)

module.exports = GameBoardContainer;