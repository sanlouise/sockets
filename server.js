var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

//Front-end
app.use(express.static(__dirname + '/public'));

//To store room name user is in
var clientInfo = {};

//Listen to events, here a connection
//Socket is an individual client (a computer) that emits something to a server
io.on('connect', function (socket) {
	console.log('User is connected via socket.io!');

	socket.on('joinRoom', function (req) {
		//Stores dynamic room name with a unique identifier
		clientInfo[socket.id] = req;
		//Join is specific to sockets, tells socket.io library to connect socket to specific room
		socket.join(req.room);
		//Tells all members that someone joined the room
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' joined the room!',
			timestamp: moment().valueOf()
		});

	});

	socket.on('message', function (message) {
		//Emit event to other connections
		console.log('Your message was received: ' + message.text);
		//Add timestamps. valueOf returns Javascript timestamp, ms version of UNIX timestamp.
		message.timestamp = moment().valueOf();
		//Sends to everyone except for the client that sent it. Only to the room of the current user!
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to Chatty!',
		timestamp: moment.valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});