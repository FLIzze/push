import { WebSocketServer } from "ws";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

type WsPlayersList = {
    type: "playersList";
    data: PlayerData[];
}

type PlayerData = {
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

const players: PlayerData[] = [];

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
        case "connect":
            const dataConnect: WsConnect = parsedMessage;

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

            players.push(dataConnect.data);

            for (const client of wss.clients) {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(dataConnect));
                }
            }
            break;
        case "cords":
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
        console.log("NO DISCONNECTED NO");
    });
});

setInterval(() => {
    const dataBroadcast: ServerBroadcast = {
        type: "broadcast",
        data: players.map(player => ({
            id: player.id,
            cords: player.cords,
        })),
    };

    const message = JSON.stringify(dataBroadcast);
    for (const client of wss.clients) {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    }
}, 1000 / 30);

console.log(`WebSocket server running on ws://localhost:${PORT}`);
