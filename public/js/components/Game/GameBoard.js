import React from 'react';
import { connect } from 'react-redux'
import { p1CardSelected, p2CardSelected, p1SpotSelected, p2SpotSelected } from '../../actions'
import Card from './Card.js';
import CardSpot from './CardSpot.js';

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
					socket.emit("p1 card died", card.name);
				else 
					socket.emit("p2 card died", card.name);

			} else {
				/* Reversed because the 'player' is being attacked */
				if (player == "p1")
					socket.emit("p2 attacking", card.name, card.hp);
				else
					socket.emit("p1 attacking", card.name, card.hp);
			}
			// reset for next turn
			this.setState({
				cardSelected: null,
				attacker: null,
			});
		} else {
			console.log("No attacker Error!");
		}
	}

	render() {
		return (
			<div style={{width: "100%", height: "100%", padding: "5% 8%"}}>
				<Card card={this.props.p1Cards[0]} otherSelected={this.props.p1CardSelected} showAvailable={this.showSpots.bind(this)} player={"p1"}/>
				<Card card={this.props.p1Cards[1]} otherSelected={this.props.p1CardSelected} showAvailable={this.showSpots.bind(this)} player={"p1"}/>
				<Card card={this.props.p1Cards[2]} otherSelected={this.props.p1CardSelected} showAvailable={this.showSpots.bind(this)} player={"p1"}/>

				<div style={{border: "1px dashed red", width: "90%", height: "70%", position: "relative", clear: "both"}}>
					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot loc={0} cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p1Spots[0]} player={"p1"}/>
							<CardSpot loc={1} cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p1Spots[1]} player={"p1"}/>
							<CardSpot loc={2} cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p1Spots[2]} player={"p1"}/>
							<CardSpot loc={3} cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p1Spots[3]} player={"p1"}/>
							<CardSpot loc={4} cardToPlace={this.state.cardSelected} showGlow={this.props.p1CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p2SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p1Spots[4]} player={"p1"}/>
						</div>
					</div>

					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute", bottom: "0px"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot loc={5} cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p2Spots[0]} player={"p2"} />
							<CardSpot loc={6} cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p2Spots[1]} player={"p2"} />
							<CardSpot loc={7} cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p2Spots[2]} player={"p2"} />
							<CardSpot loc={8} cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p2Spots[3]} player={"p2"} />
							<CardSpot loc={9} cardToPlace={this.state.cardSelected} showGlow={this.props.p2CardSelected} getTarget={this.showTargets.bind(this)} showTarget={this.props.p1SpotSelected} executeAttack={this.attack.bind(this)} card={this.props.p2Spots[4]} player={"p2"} />
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
	p1CardFunc: React.PropTypes.func,
	p2CardFunc: React.PropTypes.func,
	p1SpotFunc: React.PropTypes.func,
	p2SpotFunc: React.PropTypes.func,
	p1Spots: React.PropTypes.array,
	p2Spots: React.PropTypes.array,
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
		p1Spots: state.p1Spots,
		p2Spots: state.p2Spots
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
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
		}
	}
}

const GameBoardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameBoard)

module.exports = GameBoardContainer;