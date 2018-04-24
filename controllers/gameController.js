const room = require("../models/room");

exports.createRoom = function () {
    room.createRoom();
}

exports.joinRoom = function (index, cid) {
    const r = room.rooms[index];
    data = { room: r, player: r.addPlayer(cid) };
    return data;
}

exports.getRooms = function () {
    return room.rooms.length == 0 ? "" : room.rooms;
}

exports.move = function (data) {
    return room.rooms[data.room].movePlayer(data);
}

exports.removePlayer = function (cid) {
    for (const r in room.rooms) {
        const id = room.rooms[r].removePlayerByCID(cid);
        if (id >= 0) {
            return { roomId: r, playerId: id };
        }
    }
}

exports.createRoom();