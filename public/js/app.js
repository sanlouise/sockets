var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

var socket = io();

jQuery('#room-name').text(room);

//Listen for connect event
socket.on('connect', function () {
	console.log('Connected to the socket.io server!');
	//Join specific room
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

//Listen for emit event. Append messages to the right div.
socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message:');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
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