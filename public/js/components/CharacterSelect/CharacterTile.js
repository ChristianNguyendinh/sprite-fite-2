import React from 'react'
import { connect } from 'react-redux'

class CharacterTile extends React.Component {
    constructor(props) {
        super(props);
    }

	handleClick(e) {
		if (!this.props.card.selected) {
			if (!this.props.totalCards()) {
				console.log(this.props.card.name + " selected.");
				this.props.savec(this.props.card);
			} else {
				console.error("Max number of cards already selected!");
			}
		} else {
			console.log(this.props.card.name + " UNSELECTED!!!.");
			// Decrement the selected card count
			this.props.totalCards(true);

			this.props.unsavec(this.props.card);
		}
	}

	render() {
		let shadow = this.props.card.selected ? "0px 0px 30px #0f0" : "";
		return (
			<div className="characterTile" onClick={this.handleClick.bind(this)} style={{boxShadow: shadow}}>
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

module.exports = CharacterTile;