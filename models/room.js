const Player = require("./player.js");

exports.rooms = [];

let nextId = 0;

class Room {
    constructor() {
        exports.rooms.push(this);
        this.id = nextId++;
        this.players = []
        this.height = 512;
        this.width = 640;
    }

    addPlayer(cid) {
        const p = new Player(cid);
        this.players.push(p);
        return p;
    }

    movePlayer(data) {
        const x = data.pos.x;
        const y = data.pos.y;
        let succ = false;
        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            let r = exports.rooms[data.room].players.find(function (p) { return p.id === data.id });
            if (r != null) {
                r.x = x;
                r.y = y;
                succ = true;
            }
        }
        return succ;
    }

    removePlayerByCID(cid) {
        const index = this.players.findIndex(p => p.cid === cid);
        if (index !== -1) {
            const a = this.players.splice(index, 1);
            return a[0].id;
        }
        else
        {
            return -1;
        }
    }

}

exports.createRoom = function () {
    return new Room();
}