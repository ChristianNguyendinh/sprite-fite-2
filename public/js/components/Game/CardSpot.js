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
			<div onClick={this.handleClick.bind(this)} style={{border: "1px solid black", width: "14%", height: "100%", marginLeft: "5%", display: "inline-block", boxShadow: shadow, verticalAlign: "top"}}>
			<center>
				<span style={{margin: "0px"}}>{this.props.card && !this.props.card.dead ? this.props.card.name : ""}</span>
				<img src={this.props.card && !this.props.card.dead ? "images/" + this.props.card.image : img} style={{width: "75%"}}/>
				<div>
					<span style={{margin: "0px", float: "left"}}>{this.props.card && !this.props.card.dead ? this.props.card.hp : ""}</span>
					<span style={{margin: "0px", float: "right"}}>{this.props.card && !this.props.card.dead ? this.props.card.atk : ""}</span>
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