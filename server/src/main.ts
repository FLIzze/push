import { WebSocketServer, WebSocket } from "ws";
import { Player } from "../../client/src/game/player.ts";
import { Obstacle } from "../../client/src/obstacle.ts";
import type { WsPlayersCordBroadcast, Cords } from "../../types/types.ts";
import { handleConnection } from "./handler.ts";
import { broadcast } from "./broadcast.ts";

interface WsExtended extends WebSocket {
    playerId?: string;
};

const port = 8080;
const wss = new WebSocketServer({ port });

const players: Map<string, Player> = new Map();
const obstacles: Set<Obstacle> = new Set();

const floor = new Obstacle({ x: 0, y: 400 }, { x: 1500, y: 30 }, "black");
const wall = new Obstacle({ x: 600, y: 300 }, { x: 50, y: 100 }, "blue");
obstacles.add(floor);
obstacles.add(wall);

setInterval(() => update(), 1000 / 60);

wss.on("connection", (ws: WsExtended) => {
    handleConnection(ws, players, obstacles, wss);
});

function update() {
    const cords: Cords[] = [];

    for (const player of players.values()) {
        player.update(obstacles);

        if (player.hasMoved()) {
            cords.push({
                cords: player.cords,
                id: player.id,
            });
        }
    }

    if (cords.length === 0) {
        return;
    }

    const dataBroadcast: WsPlayersCordBroadcast = {
        type: "broadcast",
        cords: cords,
    };

    for (const data of dataBroadcast.cords) {
        const id = data.id.slice(0, 8);
        console.log(
            `\x1b[35m[${new Date().toISOString()}] BROADCASTING\x1b[0m : \x1b[33mPLAYER ${id}\x1b[0m CORDS: X: \x1b[32m${data.cords.x.toFixed(2)}\x1b[0m, Y: \x1b[32m${data.cords.y.toFixed(2)}\x1b[0m`
        );
    }

    const message = JSON.stringify(dataBroadcast);
    broadcast(message, wss);
}
