import React from 'react'

class WinScreen extends React.Component {
	render() {
		return (
			<div id="win-screen">
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