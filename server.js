const PORT = process.env.PORT || 3000,
express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http),
moment = require('moment');

//Front-end
app.use(express.static(__dirname + '/public'));

//To store room name user is in
let roomId = {};

//Sends current users to socket
const connectUsers = (socket) => {
	//Check what room the user is in
	const socketId = roomId[socket.id];
	//Empty array to push users in room to
	let users = [];

	//Check if chat room still exists
	if (typeof socketId === 'undefined') {
		return;
	}
	//Search through roomId. Takes object and returns array of all attributes on that object.
	// Here we check if room name is equal to current user's room.
	Object.keys(roomId).forEach(function (socketId) {
		const userId = roomId[socketId];

		if (socketId.room === userId.room) {
			users.push(userId.name);
		}
	});
	//Emit all the names of the people in the same room
	socket.emit('message', {
		name: 'System',
		text: 'Users in chat room: ' + users.join(', '),
		timestamp: moment().valueOf()
	})
}

//Listen to events, here a connection
//Socket is an individual client (a computer) that emits something to a server
io.on('connect', (socket) => {
	console.log('User is connected via socket.io!');

	// To disconnect. This is an inbuilt method.
	socket.on('disconnect', () => {
		const userData = roomId[socket.id];
		//Check if connected in a chat room
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);

			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left the room.',
				timestamp: moment().valueOf()
			});
			delete roomId[socket.id];
		}
	});

	socket.on('joinRoom', (req) => {
		//Stores dynamic room name with a unique identifier
		roomId[socket.id] = req;
		//Join is specific to sockets, tells socket.io library to connect socket to specific room
		socket.join(req.room);
		//Tells all members that someone joined the room
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' joined the room!',
			timestamp: moment().valueOf()
		});

	});

	socket.on('message', (message) => {
		//Check if a message is a command, otherwise run default message
		if (message.text === '@currentUsers') {
			connectUsers(socket);
		} else {
			//Add timestamps. valueOf returns Javascript timestamp, ms version of UNIX timestamp.
			message.timestamp = moment().valueOf();
			//Sends to everyone except for the client that sent it. Only to the room of the current user!
			io.to(roomId[socket.id].room).emit('message', message);

		}
		//Emit event to other connections
		console.log('Your message was received: ' + message.text);

	});

	// socket.emit('message', {
	// 	name: 'System',
	// 	text: 'Welcome to Chatty!',
	// 	timestamp: moment.valueOf()
	// });
});

http.listen(PORT, () => {
	console.log('Server started!');
});
