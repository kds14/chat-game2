const room = require("../models/room");

exports.createRoom = function()
{
    const r = room.createRoom();
}

exports.createRoom();
exports.getRooms = function()
{
    return room.rooms.length == 0 ? "" : room.rooms;
}