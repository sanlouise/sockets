var socket = io();

//Listen for connect event
socket.on('connect', function () {
	console.log('Connected to the socket.io server!');
});

//Listen for emit event
socket.on('message', function (message) {
	console.log('New message:');
	console.log(message.text);

	//Adding incoming messages to the screen
	jQuery('.messages').append('<p>' + message.text + '</p>');
});

//Handles the submission of a new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val()
	});
	$message.val('');
});