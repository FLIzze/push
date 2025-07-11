import { Player } from "./player";
import { Direction } from "../types";
import type { WsConnect, WsDisconnect, WsInputs, WsPlayersCordBroadcast, WsPlayersList } from "../../types/types.ts"

const PORT = 8080;
const HOST = "localhost";

const ws = new WebSocket(`ws://${HOST}:${PORT}`);
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 1500;
canvas.height = 500;

const player = new Player();
const players = new Map<string, Player>;

ws.onopen = () => {
    players.set(player.id, player);

    const data: WsConnect = {
        type: "connect",
        playerData: {
            id: player.id,
            size: player.size,
            cords: player.cords,
            color: player.color,
        },
    };

    ws.send(JSON.stringify(data));
};

ws.onmessage = (event) => {
    let parsedMessage: any;
    try {
        parsedMessage = JSON.parse(event.data);
    } catch (err) {
        console.error(`Error parsing message: ${err}`);
        return;
    }

    switch (parsedMessage.type) {
        case "broadcast":
            // sent 60 times a second, all players position
            const dataBroadcast: WsPlayersCordBroadcast = parsedMessage;

            for (const cords of dataBroadcast.data) {
                const player = players.get(cords.id);

                if (!player) {
                    console.error("Could not match id with a player");
                    return;
                }

                player.cords = cords.cords;
            }

            break
        case "connect":
            const dataConnect: WsConnect = parsedMessage;
            const newPlayer = new Player(dataConnect.playerData);
            players.set(newPlayer.id, newPlayer);
            break;
        case "playersList":
            const dataPlayerList: WsPlayersList = parsedMessage;
            for (const playerData of dataPlayerList.playersData) {
                const newPlayer = new Player(playerData);
                players.set(newPlayer.id, newPlayer);
            }
            break;
        case "disconnect":
            const dataDisconnect: WsDisconnect = parsedMessage;
            players.delete(dataDisconnect.id);
            break;
        default:
            console.log(`unknown type ${parsedMessage.type}`);
            break;
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === "a") player.startMove(Direction.Left);
    if (e.key === "d") player.startMove(Direction.Right);
    if (e.key === " ") player.startMove(Direction.Up)
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a") player.stopMove(Direction.Left);
    if (e.key === "d") player.stopMove(Direction.Right);
    if (e.key === " ") player.stopMove(Direction.Up)
});

function drawPlayers(ctx: CanvasRenderingContext2D, players: Map<string, Player>) {
    for (const player of players.values()) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.cords.x, player.cords.y, player.size.x, player.size.y);
    }
}

function sendInputs() {
    if (ws.readyState === ws.OPEN) {
        const wsInputs: WsInputs = {
            type: "inputs",
            inputs: Array.from(player.inputs),
        }
        ws.send(JSON.stringify(wsInputs));
    }
}

function gameLoop() {
    sendInputs();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers(ctx, players);

    requestAnimationFrame(gameLoop);
}

gameLoop();
