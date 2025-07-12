import { RawData, WebSocket, WebSocketServer } from "ws";
import { Player } from "../client/src/player.ts";
import { Obstacle } from "../client/src/obstacle.ts";
import type { WsConnect, WsDisconnect, WsInputs, WsPlayersCordBroadcast, WsGameData, Cords, WsPing } from "../types/types.ts";

interface WsExtended extends WebSocket {
    playerId?: string;
};

export class GameServer {
    private _wss: WebSocketServer;
    private _players: Map<string, Player> = new Map();
    private _obstacles: Set<Obstacle> = new Set();

    constructor(port: number) {
        const floor = new Obstacle({ x: 0, y: 400 }, { x: 1500, y: 30 }, "black");
        const wall = new Obstacle({ x: 600, y: 300 }, { x: 50, y: 100 }, "blue");

        this._obstacles.add(floor);
        this._obstacles.add(wall);

        this._wss = new WebSocketServer({ port });
        this._wss.on("connection", (ws: WsExtended) => this.handleConnection(ws));

        setInterval(() => this.update(), 1000 / 60);

        console.log(`WebSocket server running on ws://localhost:${port}`);
    }

    private handleConnection(ws: WebSocket) {
        ws.on("message", (message) => {
            this.handleMessage(ws, message);
        });

        ws.on("close", () => {
            this.handleDisconnect(ws);
        });
    }

    private update() {
        const cords: Cords[] = [];

        for (const player of this._players.values()) {
            player.update(this._obstacles);

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
        this.broadcast(message);
    }

    private broadcast(message: string) {
        for (const client of this._wss.clients) {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        }
    }

    private handleInputs(ws: WsExtended, parsedMessage: any) {
        const dataInput: WsInputs = parsedMessage;

        if (!ws.playerId) {
            console.error("Could not determine player id");
            return;
        }

        const player = this._players.get(ws.playerId);
        if (!player) {
            console.error("Error matching player with id");
            return;
        }

        console.log(
            `\x1b[34mINPUTS\x1b[0m       : FROM   \x1b[33m${ws.playerId}\x1b[0m \x1b[36m[${dataInput.inputs.join(", ")}]\x1b[0m`
        );

        player.inputs = new Set(dataInput.inputs);
    }

    private handleConnect(ws: WsExtended, parsedMessage: any) {
        const dataConnect: WsConnect = parsedMessage;

        ws.playerId = dataConnect.playerData.id;
        const newPlayer = new Player(dataConnect.playerData);
        this._players.set(ws.playerId, newPlayer);

        // sends all players to new player
        const gameData: WsGameData = {
            type: "gameData",
            playersData: Array.from(this._players.values()).map(player => ({
                id: player.id,
                color: player.color,
                cords: player.cords,
                size: player.size,
            })),
            obstaclesData: Array.from(this._obstacles).map(obstacle => ({
                color: obstacle.color,
                cords: obstacle.cords,
                size: obstacle.size,
            })),
        };

        ws.send(JSON.stringify(gameData));

        // broadcast new player information to all players
        const message: WsConnect = {
            type: "connect",
            playerData: dataConnect.playerData,
        }
        this.broadcast(JSON.stringify(message));

        console.log(
            `\x1b[32mCONNECTED\x1b[0m    : \x1b[33m${dataConnect.playerData.id}\x1b[0m`
        );
    }

    private handleMessage(ws: WsExtended, message: RawData) {
        // type will be determined in case
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
            case "connect":
                this.handleConnect(ws, parsedMessage);
                break;
            case "inputs":
                this.handleInputs(ws, parsedMessage);
                break;
            case "ping":
                this.handlePing(ws, parsedMessage);
                break;
            default:
                console.log(`unknown type ${parsedMessage.type}`);
                break;
        }
    }

    private handleDisconnect(ws: WsExtended) {
        if (!ws.playerId) {
            console.error("No playerId found!");
            return;
        }

        this._players.delete(ws.playerId);

        const dataDisconnect: WsDisconnect = {
            type: "disconnect",
            id: ws.playerId
        };
        const message = JSON.stringify(dataDisconnect);
        this.broadcast(message);

        console.log(
            `\x1b[31mDISCONNECTED\x1b[0m : \x1b[33m${ws.playerId}\x1b[0m`
        );
    }

    private handlePing(ws: WsExtended, parsedMessage: any) {
        const dataPing: WsPing = parsedMessage;
        ws.send(JSON.stringify(dataPing));
    }
}

new GameServer(8080);
