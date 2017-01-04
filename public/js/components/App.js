var React = require('react');
var cardsJSON = require('../../../cards.json');

var tempCards = [{
			"name" : "AverageJoe", 
			"image" : "AverageJoe.jpg"
		},
		{
			"name" : "Macho-Macho", 
			"image" : "BC_Macho-Macho.jpg"
		},
		{
			"name" : "Clown1", 
			"image" : "Clown1.jpg"
		}];

var CharacterTile = React.createClass({
	propTypes: {
		cardName: React.PropTypes.string,
		imageLoc: React.PropTypes.string
	},
	getInitialState: function() {
		return {
			isSelected: false,
			selectedGlow: {}
		};
	},
	handleClick: function(e) {
		if (!this.state.isSelected) {
			console.log(this.props.cardName + " selected.");
			this.setState({
				isSelected: true,
				selectedGlow: {boxShadow: "0px 0px 30px #0f0"}
			});
		} else {
			console.log(this.props.cardName + " UNSELECTED.");
			this.setState({
				isSelected: false,
				selectedGlow: {}
			});
		}
	},
	render: function() {
		return (
			<div className="characterTile" onClick={this.handleClick} style={this.state.selectedGlow}>
			<center>
				<p>{this.props.cardName}</p>
				<img src={"images/" + this.props.imageLoc} />
			</center>
			</div>
		);
	}
});

var CharacterSelect = React.createClass({
	render: function() {
		return (
			<div style={{backgroundColor: "blue", width: "100%", height: "100%"}}>
				<h1>Cards</h1>
				{cardsJSON['cards'].map(function(card, index) {
					return (
						<CharacterTile key={index} cardName={card.name} imageLoc={card.image}/>
					);
				})}
			</div>
		);
	}
});

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var Card = React.createClass({
	propTypes: {
	//	cardName: React.PropTypes.string,
	//	imageLoc: React.PropTypes.string,
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
			this.props.showAvailable(this.state.isSelected, this.props.player)
		} else {
			console.log("Something went wrong showing avail");
		}
	},
	render: function() {
		return (
			<div onClick={this.handleClick} style={{backgroundColor: "red", width: "10%", height: "15%", display:"inline-block", margin: "5px", float: "left", boxShadow: this.state.selectedGlow}}>
			</div>
		);
	}
});

var CardSpot = React.createClass({
	propTypes: {
		showGlow: React.PropTypes.bool,
	},
	render: function() {
		var shadow = this.props.showGlow ? "0px 0px 30px #00f" : "none";
		return (
			<div style={{border: "1px solid black", width: "14%", height: "100%", marginLeft: "5%", display: "inline-block", boxShadow: shadow}}>
			</div>
		);
	}
});

var GameBoard = React.createClass({
	getInitialState: function() {
		return {
			p1CardSelected: false,
			p2CardSelected: false
		};
	},
	showSpots: function(selected, player) {
		console.log(selected + "  -  " + player);
		if (player == "p1") {
			this.setState({
				p1CardSelected: selected,
				p2CardSelected: this.state.p2CardSelected
			});
		} else if (player == "p2") {
			this.setState({
				p1CardSelected: this.state.p1CardSelected,
				p2CardSelected: selected
			});
		} else {
			console.log("Error showing cards for " + player);
		}
	},
	render: function() {
		return (
			<div style={{backgroundColor: "white", width: "100%", height: "100%", padding: "5% 8%"}}>
				<Card otherSelected={this.state.p1CardSelected} showAvailable={this.showSpots} player={"p1"}/>
				<Card otherSelected={this.state.p1CardSelected} showAvailable={this.showSpots} player={"p1"}/>
				<Card otherSelected={this.state.p1CardSelected} showAvailable={this.showSpots} player={"p1"}/>

				<div style={{border: "1px dashed red", width: "90%", height: "70%", position: "relative", clear: "both"}}>
					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot showGlow={this.state.p1CardSelected}/>
							<CardSpot showGlow={this.state.p1CardSelected}/>
							<CardSpot showGlow={this.state.p1CardSelected}/>
							<CardSpot showGlow={this.state.p1CardSelected}/>
							<CardSpot showGlow={this.state.p1CardSelected}/>
						</div>
					</div>

					<div style={{border: "1px solid black", width: "100%", height: "40%", position: "absolute", bottom: "0px"}}>
						<div style={{border: "1px dashed green", width: "90%", height: "90%", position: "absolute", top: "5%", left: "5%"}}>
							<CardSpot showGlow={this.state.p2CardSelected}/>
							<CardSpot showGlow={this.state.p2CardSelected}/>
							<CardSpot showGlow={this.state.p2CardSelected}/>
							<CardSpot showGlow={this.state.p2CardSelected}/>
							<CardSpot showGlow={this.state.p2CardSelected}/>	
						</div>
					</div>
				</div>

				<Card otherSelected={this.state.p2CardSelected} showAvailable={this.showSpots} player={"p2"}/>
				<Card otherSelected={this.state.p2CardSelected} showAvailable={this.showSpots} player={"p2"}/>
				<Card otherSelected={this.state.p2CardSelected} showAvailable={this.showSpots} player={"p2"}/>

			</div>
		);
	}
});

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var App = React.createClass({
	render: function() {
		console.log(cardsJSON);
		return (
			<GameBoard />
		);
	}
});

module.exports = App;
