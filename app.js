var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

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

// socket.io
io.on('connection', (socket) => {
	console.log("Socket " + socket.id + " has connected!")

	socket.on('change game state', (newState) => {
		console.log("new state - " + newState);
		io.emit('reply', newState);
	});

	socket.on('select card', (card) => {
		console.log("selected a card");
		io.emit('selected card', card);
	});

	socket.on('disconnect', () => {
		console.log("Socket " + socket.id + " has disconnected...");
	});
});

server.listen(3000, () => {
	console.log("Server running on localhost:3000");
});