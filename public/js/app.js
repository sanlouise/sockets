var socket = io();

//Listen for connect event
socket.on('connect', function () {
	console.log('Connected to the socket.io server!');
});

//Listen for emit event
socket.on('message', function (message) {
	console.log('New message:');
	console.log(message.text);
})