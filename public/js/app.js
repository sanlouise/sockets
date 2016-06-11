var name = getQueryVariable('name');
var room = getQueryVariable('room');

var socket = io();

//Listen for connect event
socket.on('connect', function () {
	console.log('Connected to the socket.io server!');
});

//Listen for emit event
socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages')
	console.log('New message:');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	//Adding incoming messages to the screen
	$message.append('<p>' + message.text + '</p>');

});

//Handles the submission of a new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	$message.val('');
});