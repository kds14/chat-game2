const game = require("./game.js");
const io = require("socket.io-client");
socket = io();

exports.movePlayer = function (data) {
	socket.emit("move", data);
}

exports.sendText = function (data) {
	socket.emit("sendText", data);
}

exports.joinRoom = function (data) {
	socket.emit("initial-join", data);
}

socket.on("join", function (data) {
	p = game.findPlayer(data.player.id)
	if (p == null) {
		game.handleJoin(data.player.id, data.player.x, data.player.y,
			data.room.id, data.room.players, false);
	}
});

socket.on("initial-join", function (data) {
	game.handleJoin(data.player.id, data.player.x, data.player.y,
		data.room.id, data.room.players, true);
});

socket.on("sendText", function (data) {
	p = game.findPlayer(data.id)
	if (p != null) {
		game.displaySpeech(data.text, p);
	}
});

socket.on("move", function (data) {
	p = game.findPlayer(data.id)
	if (p != null) {
		p.position.x = data.pos.x
		p.position.y = data.pos.y
	}
});

game.setClient(exports);