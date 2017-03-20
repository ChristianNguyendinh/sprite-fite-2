import React from 'react';
import { connect } from 'react-redux'

class CardSpot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			selected: false
        }
    }

	handleClick(e) {
		// Picking a spot for a card
		if (this.props.showGlow && !this.props.card) {
			this.setState({
				selected: false,
			});
			socket.emit('place card', this.props.cardToPlace, this.props.loc)
		// Selecting a spot with the card in it
		} else if (!this.props.showGlow && this.props.card && !this.props.showTarget) {
			this.setState({
				selected: !this.state.selected,
			}, this.getTargets.bind(this));
		// Selecting a spot for attack
		} else if (!this.props.showGlow && this.props.card && this.props.showTarget) {
			this.attack();
		}
	}

	getTargets() {
		if (this.props.getTarget) {
			this.props.getTarget(this.props.player, this.props.card, this.state.selected);
		}
	}

	attack() {
		if (this.props.executeAttack) {
			this.props.executeAttack(this.props.card, this.props.player);
		}
	}

	render() {
		var shadow;
		if (this.props.showGlow && !this.props.card && !this.props.showTarget) {
			shadow = "0px 0px 30px #00f"
		} else if (!this.props.showGlow && this.props.card && this.state.selected) {
			shadow = "0px 0px 30px #0f0"
		} else if (this.props.showTarget && this.props.card && !this.props.card.dead) {
			shadow = "0px 0px 30px #f00"
		} else {
			shadow = "none";
		}
		var img = this.props.card && this.props.card.dead ? "images/red.jpg" : "images/white.jpg"
		return (
			<div className="card-spot" onClick={this.handleClick.bind(this)} style={{boxShadow: shadow}}>
			<center>
				<span className="card-spot-name">{this.props.card && !this.props.card.dead ? this.props.card.name : ""}</span>
				<img src={this.props.card && !this.props.card.dead ? "images/" + this.props.card.image : img} className="card-spot-img"/>
				<div>
					<span className="card-spot-hp">{this.props.card && !this.props.card.dead ? this.props.card.hp : ""}</span>
					<span className="card-spot-atk">{this.props.card && !this.props.card.dead ? this.props.card.atk : ""}</span>
				</div>
			</center>
			</div>
		);
	}
}
CardSpot.propTypes = {
	loc: React.PropTypes.number,
    player: React.PropTypes.string,
    showGlow: React.PropTypes.bool,
	card: React.PropTypes.object,
    showTarget: React.PropTypes.bool,
    cardToPlace: React.PropTypes.object,
    getTarget: React.PropTypes.func,
}

module.exports = CardSpot;