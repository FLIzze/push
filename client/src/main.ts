import { Player } from "./player";
import { Direction } from "../types";

const PORT = 8080;
const HOST = "localhost";

const ws = new WebSocket(`ws://${HOST}:${PORT}`);

const player = new Player({ x: 30, y: 50 }, "red", "rensky");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const players: PlayerData[] = [];

canvas.width = 1500;
canvas.height = 500;

type WsPlayersList = {
    type: "playersList";
    data: PlayerData[];
}

export type PlayerData = {
    id: string;
    name: string;
    size: { x: number, y: number };
    cords: { x: number, y: number };
    color: string;
}

export type WsConnect = {
    type: "connect";
    data: PlayerData;
}

// type WsDisconnect = {
//     type: "disconnect";
//     data: {
//         id: string;
//     };
// }

type WsCords = {
    type: "cords";
    data: PlayerInfo;
}

type ServerBroadcast = {
    type: "broadcast";
    data: PlayerInfo[];
}

type PlayerInfo = {
    cords: { x: number, y: number };
    id: string;
}

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
        const dataBroadcast: ServerBroadcast = parsedMessage;
        for (const player of dataBroadcast.data) {
            const internalPlayer = players.find(p => p.id === player.id);
            if (internalPlayer) {
                internalPlayer.cords = player.cords;
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
    player.applyGravity(ctx);
    player.update();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx, players);

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

    requestAnimationFrame(gameLoop);
}

gameLoop();
