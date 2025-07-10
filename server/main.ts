import { WebSocket, WebSocketServer } from "ws";
import type { PlayerData, WsConnect, WsCords, WsDisconnect, WsPlayersCordBroadcast, WsPlayersList } from "../types/types.ts";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const players: PlayerData[] = [];

interface ExtendedWs extends WebSocket {
    playerId?: string;
};

wss.on("connection", (ws: ExtendedWs) => {
    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
        case "connect":
            const dataConnect: WsConnect = parsedMessage;
            players.push(dataConnect.data);
            ws.playerId = dataConnect.data.id;

            // sends all players to new player
            const playersList: WsPlayersList = {
                type: "playersList",
                data: players.map(player => ({
                    id: player.id,
                    name: player.name,
                    size: player.size,
                    cords: player.cords,
                    color: player.color,
                })),
            };
            ws.send(JSON.stringify(playersList));

            // broadcast new player information to all players
            for (const client of wss.clients) {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(dataConnect));
                }
            }
            break;
        case "cords":
            // refreshes player cords
            const dataCords: WsCords = parsedMessage;
            const player = players.find(player => player.id === dataCords.data.id);
            if (player) {
                player.cords = dataCords.data.cords;
            }
            break;
        default:
            console.log(`unknown type ${parsedMessage.type}`);
            break;
        }
    });

    ws.on("close", () => {
        if (!ws.playerId) {
            return;
        }

        const player = players.findIndex(player => player.id === ws.playerId);
        players.splice(player, 1);

        const dataDisconnect: WsDisconnect = {
            type: "disconnect",
            data: {
                id: ws.playerId
            },
        };
        const message = JSON.stringify(dataDisconnect);
        broadcast(message);
    });
});

setInterval(() => {
    const dataBroadcast: WsPlayersCordBroadcast = {
        type: "broadcast",
        data: players.map(player => ({
            id: player.id,
            cords: player.cords,
        })),
    };

    const message = JSON.stringify(dataBroadcast);
    broadcast(message);
}, 1000 / 60);

function broadcast(message: string) {
    for (const client of wss.clients) {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    }
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);
