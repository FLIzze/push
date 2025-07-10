import { Player } from "./player";
import { Direction } from "../types";
import type { PlayerData, WsConnect, WsCords, WsDisconnect, WsPlayersCordBroadcast, WsPlayersList } from "../../types/types.ts"

const PORT = 8080;
const HOST = "localhost";

const ws = new WebSocket(`ws://${HOST}:${PORT}`);

const player = new Player({ x: 30, y: 50 }, "red", "rensky");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const players: PlayerData[] = [];

canvas.width = 1500;
canvas.height = 500;

ws.onopen = () => {
    const data: WsConnect = {
        type: "connect",
        data: {
            id: player.id,
            name: player.name,
            size: player.size,
            cords: player.cords,
            color: player.color
        },
    };

    ws.send(JSON.stringify(data));
};

ws.onmessage = (event) => {
    const parsedMessage = JSON.parse(event.data);

    switch (parsedMessage.type) {
    case "broadcast":
        // sent 60 times a second, all players position
        const dataBroadcast: WsPlayersCordBroadcast = parsedMessage;

        for (const player of dataBroadcast.data) {
            const p = players.find(p => p.id === player.id);
            if (p) {
                p.cords = player.cords;
            }
        }

        break
    case "connect":
        const dataConnect: WsConnect = parsedMessage;
        players.push(dataConnect.data);
        break;
    case "playersList":
        const dataPlayerList: WsPlayersList = parsedMessage;
        for (const player of dataPlayerList.data) {
            players.push(player);
        }
        break;
    case "disconnect":
        const dataDisconnect: WsDisconnect = parsedMessage;
        const player = players.findIndex(player => player.id === dataDisconnect.data.id);
        players.splice(player, 1);
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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.applyGravity(ctx);
    player.update();

    if (ws.readyState === WebSocket.OPEN) {
        const data: WsCords = {
            type: "cords",
            data: {
                cords: player.cords,
                id: player.id,
            },
        }
        ws.send(JSON.stringify(data));
    }

    player.draw(ctx, players);

    requestAnimationFrame(gameLoop);
}

gameLoop();
