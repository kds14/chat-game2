let nextId = 0;

module.exports = class Player
{
    constructor()
    {
        this.id = nextId++;
        this.x = Math.floor(Math.random() * 100) + 200;;
        this.y = Math.floor(Math.random() * 100) + 200;;
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
    }
}