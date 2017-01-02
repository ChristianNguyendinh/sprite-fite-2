var express = require('express');
var path = require('path');
var app = express();

// using ejs cause it seems the simplest, and this wont use templating that much
app.set('view engine', 'ejs');
// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routes file
var routes = require('./routes');

// home
app.get('/', routes.home);

// not found
app.get('*', routes.notFound);

app.listen(3000, function() {
	console.log("Server running on localhost:3000");
});