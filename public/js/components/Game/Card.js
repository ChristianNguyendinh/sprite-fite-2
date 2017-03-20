import React from 'react';
import { connect } from 'react-redux'

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
		let shadow = this.props.card.selected ? "0px 0px 30px #0f0" : "";
		if (this.props.card.played || this.props.card.dead)
			return null;
		return (
			<div className="card" onClick={this.handleClick.bind(this)} style={{boxShadow: this.state.selectedGlow}}>
			<center>
				<p className="card-name">{this.props.card ? this.props.card.name : "NULL"}</p>
				<img src={this.props.card ? "images/" + this.props.card.image : ""} className="card-img"/>
				<p className="card-hp">{this.props.card ? this.props.card.hp : ""}</p>
				<p className="card-atk">{this.props.card ? this.props.card.atk : ""}</p>
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

module.exports = Card;