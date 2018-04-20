const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController")

router.get("/rooms", function(req, res, next) {
  const rooms = {rooms: gameController.getRooms()};
  res.send(rooms);
});

router.post("/join", function(req, res, next) {
  res.send(gameController.joinRoom(req.body.room));
});

module.exports = router;
