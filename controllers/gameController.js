const room = require("../models/room");

exports.createRoom = function()
{
    const r = room.createRoom();
}

exports.joinRoom = function(index)
{
    let r = room.rooms[index];
    p = r.addPlayer(room);
    data = {room:r, client_id:p.id};
    // broadcast here
    console.log(data);
    return data;
}

exports.createRoom();

exports.getRooms = function()
{
    return room.rooms.length == 0 ? "" : room.rooms;
}