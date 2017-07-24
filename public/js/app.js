const name = getQueryVariable('name') || 'Anonymous';
const room = getQueryVariable('room');
const socket = io();

jQuery('#room-name').text(room);

//Listen for connect event
socket.on('connect', () => {
	console.log('Connected to the socket.io server!');
	//Join specific room
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

//Listen for emit event. Append messages to the right div.
socket.on('message', (message) => {
	const momentTimestamp = moment.utc(message.timestamp);
	const $messages = jQuery('.messages');
	const $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message:');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
});

//Handles the submission of a new message
const $form = jQuery('#message-form');

$form.on('submit', (event) => {
	event.preventDefault();

	const $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	$message.val('');
});
