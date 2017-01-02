// var x = require('../json file');

exports.home = function(req, res) {
	// by default will look in the views directory for home.ejs
	res.render('home', {
		title: "uh...",
		movies: ["asdf", "rogue 1", "a new hope"]
	});
};

exports.notFound = function(req, res) {
	res.send("THIS is a 404 not found page");
};