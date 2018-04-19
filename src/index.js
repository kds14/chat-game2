var io = require('socket.io-client');
var socket = io();

console.log("HELLO");

socket.emit("test", "THIS IS A TEST MESSAGE FROM CLIENT");

socket.on("test-server", function(msg) {
	console.log("TEST MESSAGE RECEIVED FROM SERVER");
	console.log(msg);
});
