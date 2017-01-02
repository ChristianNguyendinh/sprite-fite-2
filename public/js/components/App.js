var React = require('react');
var cardsJSON = require('../../../cards.json');

var App = React.createClass({
	render: function() {
		console.log(cardsJSON);
		return (
			<div>
				<h1>Cards</h1>
				<p>testtesttest</p>
			</div>
		);
	}
});

module.exports = App;
