import { RawData, WebSocket, WebSocketServer } from "ws";
import { Player } from "../../client/src/game/player.ts";
import { WsConnect, WsDisconnect, WsGameData, WsInputs, WsPing } from "../../types/types.ts";
import { Obstacle } from "../../client/src/obstacle.ts";
import { broadcast } from "./broadcast.ts";

interface WsExtended extends WebSocket {
    playerId?: string;
};

function handleInputs(ws: WsExtended, parsedMessage: any, players: Map<string, Player>) {
    const dataInput: WsInputs = parsedMessage;

    if (!ws.playerId) {
        console.error("Could not determine player id");
        return;
    }

    const player = players.get(ws.playerId);
    if (!player) {
        console.error("Error matching player with id");
        return;
    }

    console.log(
        `\x1b[34mINPUTS\x1b[0m       : FROM   \x1b[33m${ws.playerId}\x1b[0m \x1b[36m[${dataInput.inputs.join(", ")}]\x1b[0m`
    );

    player.inputs = new Set(dataInput.inputs);
}

function handleConnect(
    ws: WsExtended, parsedMessage: any, players: Map<string, Player>,
    obstacles: Set<Obstacle>, wss: WebSocketServer
) {
    const dataConnect: WsConnect = parsedMessage;

    ws.playerId = dataConnect.playerData.id;
    const newPlayer = new Player(dataConnect.playerData);
    players.set(ws.playerId, newPlayer);

    // sends all players to new player
    const gameData: WsGameData = {
        type: "gameData",
        playersData: Array.from(players.values()).map(player => ({
            id: player.id,
            color: player.color,
            cords: player.cords,
            size: player.size,
        })),
        obstaclesData: Array.from(obstacles).map(obstacle => ({
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
    broadcast(JSON.stringify(message), wss);

    console.log(
        `\x1b[32mCONNECTED\x1b[0m    : \x1b[33m${dataConnect.playerData.id}\x1b[0m`
    );
}

function handleMessage(ws: WsExtended, message: RawData, players: Map<string, Player>,
    obstacles: Set<Obstacle>, wss: WebSocketServer
) {
    const parsedMessage = JSON.parse(message.toString());

    switch (parsedMessage.type) {
        case "connect":
            handleConnect(ws, parsedMessage, players, obstacles, wss);
            break;
        case "inputs":
            handleInputs(ws, parsedMessage, players);
            break;
        case "ping":
            handlePing(ws, parsedMessage);
            break;
        default:
            console.log(`unknown type ${parsedMessage.type}`);
            break;
    }
}

function handleDisconnect(ws: WsExtended, players: Map<string, Player>, wss: WebSocketServer) {
    if (!ws.playerId) {
        console.error("No playerId found!");
        return;
    }

    players.delete(ws.playerId);

    const dataDisconnect: WsDisconnect = {
        type: "disconnect",
        id: ws.playerId
    };
    const message = JSON.stringify(dataDisconnect);
    broadcast(message, wss);

    console.log(
        `\x1b[31mDISCONNECTED\x1b[0m : \x1b[33m${ws.playerId}\x1b[0m`
    );
}

function handlePing(ws: WsExtended, parsedMessage: any) {
    const dataPing: WsPing = parsedMessage;
    ws.send(JSON.stringify(dataPing));
}

function handleConnection(
    ws: WsExtended, players: Map<string, Player>, obstacles: Set<Obstacle>,
    wss: WebSocketServer
) {
    ws.on("message", (message) => {
        handleMessage(ws, message, players, obstacles, wss);
    });

    ws.on("close", () => {
        handleDisconnect(ws, players, wss);
    });
}

export { handlePing, handleInputs, handleConnect, handleMessage, handleDisconnect, handleConnection };
