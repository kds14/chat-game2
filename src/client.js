const game = require("./game.js");
const io = require("socket.io-client");
socket = io();

exports.movePlayer = function (data)
{
	socket.emit("move", data);
}

exports.sendText = function (data)
{
	socket.emit("sendText", data);
}

socket.on("join", function(data)
{
	p = findPlayer(data["id"])
	if (p == null)
	{
		game.newPlayer(data["id"], data["pos"].x, data["pos"].y);
	}
});

socket.on("sendText", function(data)
{
	p = findPlayer(data["id"])
	if (p != null)
	{
		game.displaySpeech(data["text"], p);
	}
});

socket.on("move", function(data)
{
	p = findPlayer(data["id"])
	if (p != null)
	{
		p.position.x = data["pos"].x
		p.position.y = data["pos"].y
	}
});

function findPlayer (id)
{
	return game.otherPlayers.find(function(x)
	{
		x.id == id;
	});
}

game.setClient(exports);