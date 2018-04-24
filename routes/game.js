const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController")

const gameRouter = function (io) {
	router.get("/rooms", function (req, res, next) {
		const rooms = { rooms: gameController.getRooms() };
		res.send(rooms);
	});


	// routing for socket messages
	io.on("connection", function (socket) {

		socket.on("initial-join", function (data) {
			const r = gameController.joinRoom(data.roomId);
			socket.broadcast.emit("join", r);
			socket.emit("initial-join", r);
		});

		socket.on("move", function (data) {
			if (gameController.move(data)) {
				socket.broadcast.emit("move", data);
			}
		});

		socket.on("send-text", function (data) {
			if (data.text) {
				socket.broadcast.emit("send-text", data);
			}
		});
	});
	return router;
}

module.exports = gameRouter;
