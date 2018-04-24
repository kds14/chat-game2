const PIXI = require("./pixi.min.js");

const playerSpeed = 5;

const gameWidth = 640;
const gameHeight = 480;
const backgroundColor = 0x29a329;

const buttonWidth = 128;
const buttonHeight = 64;

const url = window.location.href;

const menuColorMain = 0xFFFFFF;
const menuColorSec = 0x000000;

const joinMenuTop = gameHeight / 2 - 192;
const joinMenuLeft = gameWidth / 2 - 128;
const joinMenuWidth = 256;
const joinMenuHeight = 384;

const chatBarHeight = 32;
const chatBarTop = gameHeight - chatBarHeight - 1;

const borderBot = chatBarTop - 32;
const borderLeft = 32;
const borderRight = gameWidth - 32;
const borderTop = 32;

let room = -1;

const app = new PIXI.Application({
    width: gameWidth,
    height: gameHeight,
    backgroundColor: backgroundColor
});
document.body.appendChild(app.view);

const menuStage = new PIXI.Container();
const gameStage = new PIXI.Container();
const joinStage = new PIXI.Container();

gameStage.interactive = true;
gameStage.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);

const loader = PIXI.loader;
loader.add('player', "images/face.png");
sprites = {};
otherPlayers = [];
let playerTexture;
let prevTime = 0;

app.stage = menuStage;

// menuStage setup
createButton(gameWidth / 2, gameHeight / 2, "JOIN", onJoinClick, menuStage);

// joinStage setup
let joinMenu = createRectangle(menuColorMain, menuColorSec, 5, joinMenuLeft,
    joinMenuTop, joinMenuWidth, joinMenuHeight);
joinStage.addChild(joinMenu);

// chat setup
let chatBar = createRectangle(menuColorMain, menuColorSec, 1, 1, chatBarTop,
    gameWidth - 1, chatBarHeight);
gameStage.addChild(chatBar);
let currentText = "Type up to 25 characters and press enter to chat";
let placeholder = true;
let textGraphic = new PIXI.Text(currentText);
textGraphic.x = 16;
textGraphic.y = chatBarTop + 2;
gameStage.addChild(textGraphic);

// move tutorial
const moveTutText = "Move with the arrow keys"
const moveTutorial = new PIXI.Text(moveTutText, { align: "center" });
let isMoveTut = true;
moveTutorial.x = gameWidth / 2;
moveTutorial.y = 32;
moveTutorial.anchor.set(0.5);
gameStage.addChild(moveTutorial);

// after all assets are loaded
loader.load((loader, resources) => {
    playerTexture = resources.player.texture

    window.addEventListener("keydown", onKeyDown, false);

    gameLoop(0);
});

function handleJoin(id, x, y, roomId, players, client) {
    if (roomId != room && !client) return;
    if (client)
    {
        sprites.player = newPlayer(id, x, y);
        app.stage = gameStage;
        room = roomId;
    }
    update_players(players);
}

function findPlayer(id) {
    if (sprites.player != null && sprites.player.id == id) {
        return sprites.player;
    }
    else {
        return otherPlayers.find(function (x) { return x.id == id; });
    }
}

function handleMove(id, x, y, roomId) {
    if (roomId != room) return;
}

function newPlayer(id, x, y) {
    let r = new PIXI.Sprite(playerTexture);
    r.anchor.set(0.5);
    gameStage.addChild(r);
    r.id = id;
    r.x = x;
    r.y = y;
    r.text = "";
    r.textCounter = null;
    return r;
}

function sendText() {
    let data = {
        "id": sprites.player.id,
        "text": currentText,
        "room": room
    }
    Client.sendText(data);
}

function displaySpeech(text, player, roomId) {
    if (roomId != room) return;
    if (player.text != null) player.removeChild(player.text);
    player.text = new PIXI.Text(text, { align: "center" })
    player.text.anchor.set(0.5);
    player.addChild(player.text);
    player.text.x = 0;
    player.text.y = -48;
    player.textCounter = 300;
}

function decreaseTextCounter(player) {
    if (player.textCounter != null) {
        player.textCounter -= 1;
        if (player.textCounter <= 0) {
            player.removeChild(player.text);
            player.textCounter = null;
        }
    }
}

function handleTyping(key) {
    switch (key) {
        case "Backspace":
            if (currentText.length > 0)
                currentText = currentText.substring(0, currentText.length - 1)
            break;
        case "Enter":
            sendText();
            displaySpeech(currentText, sprites.player, room);
            currentText = "";
            break;
        default:
            if (key.length === 1 && (currentText.length <= 25 || placeholder)) {
                if (placeholder) {
                    placeholder = false;
                    currentText = "";
                }
                currentText += key;
            }
            break;
    }
    textGraphic.text = currentText;
}

function onGetRoomsResponse() {
    if (this.responseText == null || this.responseText.length === 0) {
        return;
    }
    // populate joinMenu with interactable room buttons
    let r = JSON.parse(this.responseText);
    if (r != null && r.hasOwnProperty("rooms") && r.rooms.length > 0) {
        for (let i = 0; i < r.rooms.length; i++) {
            let s = "Room " + i + " (" + r.rooms[i].players.length + " players)"
            let style = new PIXI.TextStyle({ fill: "#000000" });
            const text = new PIXI.Text(s, style);
            text.anchor.set(0.5);
            text.x = gameWidth / 2;
            text.y = joinMenuTop + + text.height * (i + 1);
            text.interactive = true;
            text.mouseover = function (e) {
                text.style.fill = "#00e64d";
            }
            text.mouseout = function (e) {
                text.style.fill = "#000000";
            }
            text.on("pointerdown", function (e) {
                joinRoomRequest(i);
            });
            joinMenu.addChild(text);
        }
    }
}

function joinRoomRequest(room) {
    Client.joinRoom({ roomId: room });
}

function getRoomsRequest() {
    let req = new XMLHttpRequest();
    req.open("GET", url + "game/rooms");
    req.addEventListener("load", onGetRoomsResponse);
    req.send();
}

function createRectangle(fColor, lColor, lthickness, x, y, w, h) {
    const rect = new PIXI.Graphics();
    rect.beginFill(fColor);
    rect.lineStyle(lthickness, lColor);
    rect.drawRect(x, y, w, h);
    return rect;
}

function createButton(x, y, text, onButtonClick, stage) {
    const button = createRectangle(menuColorMain, menuColorSec, 5, x - (buttonWidth / 2),
        y - (buttonHeight / 2), buttonWidth, buttonHeight);
    button.buttonMode = true;
    button.interactive = true;
    button.on("pointerdown", onButtonClick);
    const btext = new PIXI.Text(text);
    btext.anchor.set(0.5);
    btext.x = x;
    btext.y = y;
    button.addChild(btext);
    stage.addChild(button);
}

function onJoinClick(e) {
    app.stage = joinStage;
    getRoomsRequest();
}

function update_players(players) {
    for (let p in players) {
        let r = null;
        if (sprites.player.id == players[p].id) {
            //continue;
            r = sprites.player;
        }
        else {
            r = otherPlayers.find(item => item.id == players[p].id);
            if (r == null) {
                r = newPlayer(players[p].id, 0, 0)
                otherPlayers.push(r);
            }
        }
        if (r != null) {
            r.position.x = players[p].x;
            r.position.y = players[p].y;
        }
    }
}

function update(delta) {
    switch (app.stage) {
        case menuStage:
            break;
        case gameStage:
            decreaseTextCounter(sprites.player);
            for (let i = 0; i < otherPlayers.length; i++) {
                const pp = otherPlayers[i];
                decreaseTextCounter(pp);
            }
            break;
        default:
            break;
    }
}

function gameLoop(currentTime) {
    let delta = currentTime - prevTime;
    update(delta);
    prevTime = currentTime;
    window.requestAnimationFrame(gameLoop);
}

function movePlayer(player, x, y) {
    player.position.x = x;
    player.position.y = y;
    keepPlayerInBorders(player);
}

function keepPlayerInBorders(player) {
    let x = player.position.x;
    let y = player.position.y;
    if (x == null || x <= borderLeft) {
        x = borderLeft;
    }
    else if (x >= borderRight) {
        x = borderRight;
    }
    if (y == null || y <= borderTop) {
        y = borderTop;
    }
    else if (y >= borderBot) {
        y = borderBot;
    }
    player.position.x = x;
    player.position.y = y;
}

function onKeyDown(e) {
    e.preventDefault();
    if (sprites.player == null) return;
    let x = sprites.player.position.x;
    let y = sprites.player.position.y;
    let move = false;
    switch (e.key) {
        case "ArrowUp":
            y = sprites.player.position.y - playerSpeed;
            break;
        case "ArrowDown":
            y = sprites.player.position.y + playerSpeed;
            break;
        case "ArrowRight":
            x = sprites.player.position.x + playerSpeed;
            break;
        case "ArrowLeft":
            x = sprites.player.position.x - playerSpeed;
            break;
        default:
            handleTyping(e.key);
            break;
    }
    if (sprites.player.y - y !== 0 || sprites.player.x - x !== 0) {
        if (isMoveTut) {
            gameStage.removeChild(moveTutorial);
            isMoveTut = false;
        }
        movePlayer(sprites.player, x, y);
        let data = {
            id: sprites.player.id,
            pos: { x: sprites.player.x, y: sprites.player.y },
            room: room
        }
        Client.movePlayer(data);
    }
}

exports.handleJoin = handleJoin;
exports.displaySpeech = displaySpeech;
let Client = {}
exports.setClient = function (client) {
    Client = client;
}
exports.findPlayer = findPlayer;