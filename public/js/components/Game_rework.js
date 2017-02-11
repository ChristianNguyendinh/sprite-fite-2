import React from 'react';
import { connect } from 'react-redux'
import { changeGameState, p1CardSelected, p2CardSelected, p1SpotSelected, p2SpotSelected, p1ShowAttack, p2ShowAttack, unselect } from '../actions'

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
	}

	getSpots() {
		if (this.props.showAvailable) 
			this.props.showAvailable(this.state.isSelected, this.props.player, this.props.card);
		else 
			console.log("Something went wrong showing avail");
	}

	render() {
		if (this.props.card.played)
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
			console.log(this.props.showTarget);
		// Selecting a spot for attack
		} else if (!this.props.showGlow && this.state.filled && this.props.showTarget) {
			this.attack();
		}
	}

	getTargets() {
		if (this.props.getTarget) {
			this.props.getTarget(this.props.player, this.state.card, this.unselect.bind(this));
		}
	}

	attack() {
		if (this.props.executeAttack) {
			this.props.executeAttack(this.state.card, this.props.player);
		}
	}

	unselect() {
		this.setState({
			filled: this.state.filled,
			card: this.state.card,
			selected: false,
		});
	}

	render() {
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
			p1Deaths: 0,
			p2Deaths: 0,
			cardSelected: null,
			attacker: null, 
        }
    }

	showSpots(selected, player, card) {
		let c = selected ? card : null;
		if (player == "p1") {
			this.setState({
				p1Deaths: this.state.p1Deaths,
				p2Deaths: this.state.p2Deaths,
				cardSelected: c,
				attacker: null,
			});
			this.props.p1CardFunc(true);
		} else if (player == "p2") {
			this.setState({
				p1Deaths: this.state.p1Deaths,
				p2Deaths: this.state.p2Deaths,
				cardSelected: c,
				attacker: null,
			});
			this.props.p2CardFunc(true);
		} else {
			console.log("Error showing cards for " + player);
		}
		console.log("card selected: " + c);
	}

	showTargets(player, card, unselectFunc) {
		if (player == "p1") {
			this.setState({
				p1Deaths: this.state.p1Deaths,
				p2Deaths: this.state.p2Deaths,
				cardSelected: this.state.cardSelected,
				attacker: !this.state.p1SpotSelected ? card : null,
			});
			this.props.p1SpotFunc(true);
		} else if (player == "p2") {
			this.setState({
				p1Deaths: this.state.p1Deaths,
				p2Deaths: this.state.p2Deaths,
				cardSelected: this.state.cardSelected,
				attacker: !this.state.p2SpotSelected ? card : null,
			});
			this.props.p2SpotFunc(true);
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
				if (player == "p1") {
					this.state.p1Deaths++;
					if (this.state.p1Deaths == 3) {
						console.log("P2 WINS!!!");
						this.props.changeGameState("p2win");
					}
				} else {
					this.state.p2Deaths++;
					if (this.state.p2Deaths == 3) {
						console.log("P1 WINS!!!");
						this.props.changeGameState("p1win");
					}
				}
			}
			// reset for next turn
			this.setState({
				p1Deaths: this.state.p1Deaths,
				p2Deaths: this.state.p2Deaths,
				cardSelected: null,
				attacker: null,
			});
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
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p2SpotSelected} executeAttack={this.attack.bind(this)} player={"p1"}/>
						</div>
					</div>

					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute", bottom: "0px"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
							<CardSpot cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.state.p1SpotSelected} executeAttack={this.attack.bind(this)} player={"p2"} />
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
	p1ShowAttack: React.PropTypes.bool,
	p2ShowAttack: React.PropTypes.bool,
	changeGameState: React.PropTypes.func,
	p1CardFunc: React.PropTypes.func,
	p2CardFunc: React.PropTypes.func,
	p1SpotFunc: React.PropTypes.func,
	p2SpotFunc: React.PropTypes.func,
	p1AttackingFunc: React.PropTypes.func,
	p2AttackingFunc: React.PropTypes.func,
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
		p1ShowAttack: state.p1ShowAttack,
		p2ShowAttack: state.p2ShowAttack,
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
		p1AttackingFunc: (bool) => {
			dispatch(p1ShowAttack(bool))
		},
		p2AttackingFunc: (bool) => {
			dispatch(p2ShowAttack(bool))
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