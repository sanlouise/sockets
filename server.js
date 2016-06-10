var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

//Front-end
app.use(express.static(__dirname + '/public'));

//Listen to events, here a connection
//Socket is an individual client (a computer) that emits something to a server
io.on('connect', function (socket) {
	console.log('User is connected via socket.io!');

	socket.on('message', function (message) {
		//Emit event to other connections
		console.log('Your message was received: ' + message.text);

		//Add timestamps. valueOf returns Javascript timestamp, ms version of UNIX timestamp.
		message.timestamp = moment().valueOf();
		//Sends to everyone except for the client that sent it
		io.emit('message', message);
	});

	socket.emit('message', {
		text: 'Welcome to Chatty!',
		timestamp: moment.valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});