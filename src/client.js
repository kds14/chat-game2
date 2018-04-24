const game = require("./game.js");
const io = require("socket.io-client");
socket = io();

exports.movePlayer = function (data) {
	socket.emit("move", data);
}

exports.sendText = function (data) {
	socket.emit("send-text", data);
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

socket.on("send-text", function (data) {
	p = game.findPlayer(data.id)
	if (p != null) {
		game.displaySpeech(data.text, p, data.room);
	}
});

socket.on("move", function (data) {
	p = game.findPlayer(data.id)
	if (p != null) {
		p.position.x = data.pos.x
		p.position.y = data.pos.y
	}
});

socket.on("quit", function (data) {
	game.removePlayer(data.playerId, data.roomId);
})

game.setClient(exports);