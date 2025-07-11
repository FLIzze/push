import { RawData, WebSocket, WebSocketServer } from "ws";
import { Player } from "../client/src/player.ts";
import type { WsConnect, WsDisconnect, WsInputs, WsPlayersCordBroadcast, WsPlayersList } from "../types/types.ts";

interface WsExtended extends WebSocket {
    playerId?: string;
};

export class GameServer {
    private _wss: WebSocketServer;
    private _players: Map<string, Player> = new Map();

    constructor(port: number) {
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
        for (const player of this._players.values()) {
            player.applyGravity();
            player.update();
        }

        const dataBroadcast: WsPlayersCordBroadcast = {
            type: "broadcast",
            data: Array.from(this._players.values()).map(player => ({
                id: player.id,
                cords: player.cords,
            })),
        };

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

    private handleInputs(ws: WsExtended, dataInputs: WsInputs) {
        if (!ws.playerId) {
            console.error("Could not determine player id");
            return;
        }

        const player = this._players.get(ws.playerId);
        if (!player) {
            console.error("Error matching player with id");
            return;
        }

        player.inputs = new Set(dataInputs.inputs);
    }

    private handleConnect(ws: WsExtended, dataConnect: WsConnect) {
        ws.playerId = dataConnect.playerData.id;
        const newPlayer = new Player(dataConnect.playerData);
        this._players.set(ws.playerId, newPlayer);

        // sends all players to new player
        const playersList: WsPlayersList = {
            type: "playersList",
            playersData: Array.from(this._players.values()).map(player => ({
                id: player.id,
                color: player.color,
                cords: player.cords,
                size: player.size,
            })),
        };

        ws.send(JSON.stringify(playersList));

        // broadcast new player information to all players
        const message: WsConnect = {
            type: "connect",
            playerData: dataConnect.playerData,
        }
        this.broadcast(JSON.stringify(message));
    }

    private handleMessage(ws: WebSocket, message: RawData) {
        // type will be determined in case
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
            case "connect":
                const dataConnect: WsConnect = parsedMessage;
                console.log(`CONNECTED    : ${dataConnect.playerData.id}`);
                this.handleConnect(ws, dataConnect);
                break;
            case "inputs":
                const dataInput: WsInputs = parsedMessage;
                this.handleInputs(ws, dataInput);
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

        console.log(`DISCONNECTED : ${ws.playerId}`);
    }
}

new GameServer(8080);
