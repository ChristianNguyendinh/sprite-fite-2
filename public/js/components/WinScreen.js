import React from 'react'

class WinScreen extends React.Component {
	render() {
		return (
			<div style={{width: "100%", height: "100%"}}>
				<h1>{this.props.player} WINS!!!</h1>
			</div>
		);
	}
}
WinScreen.propTypes = {
    player: React.PropTypes.string,
	changeGameState: React.PropTypes.func
}

module.exports = WinScreen;