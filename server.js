var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Front-end
app.use(express.static(__dirname + '/public'));

//Listen to events, here connection
io.on('connection', function () {
	console.log('User is connected via socket.io!');
});

http.listen(PORT, function () {
	console.log('Server started!');
});