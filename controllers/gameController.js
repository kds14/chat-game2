const room = require("../models/room");

exports.createRoom = function () {
    room.createRoom();
}

exports.joinRoom = function (index) {
    const r = room.rooms[index];
    data = { room: r, player: r.addPlayer(room) };
    return data;
}

exports.getRooms = function () {
    return room.rooms.length == 0 ? "" : room.rooms;
}

exports.move = function (data) {
    return room.rooms[data.room].movePlayer(data);
}

exports.createRoom();