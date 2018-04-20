const Player = require("./player.js");

exports.rooms = [];

let nextId = 0;

class Room
{
    constructor()
    {
        exports.rooms.push(this);
        this.id = nextId++;
        this.players = []
    }

    addPlayer()
    {
        const p = new Player();
        this.players.push(p);
        return p.id;
    }

}

exports.createRoom = function ()
{
    return new Room();
}