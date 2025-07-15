import type { WsConnect, WsDisconnect, WsPlayersCordBroadcast, WsGameData, WsPing } from "../../../types/types";
import { latency, obstacles } from "./game.ts";
import { Obstacle } from "../obstacle.ts";
import { Player } from "./player.ts";

function handleParsedMessage(parsedMessage: any, players: Map<string, Player>) {
    switch (parsedMessage.type) {
        case "broadcast":
            handleBroadcast(parsedMessage, players);
            break
        case "connect":
            handleConnect(parsedMessage, players);
            break;
        case "gameData":
            handlePlayersList(parsedMessage, players);
            break;
        case "disconnect":
            handleDisconnect(parsedMessage, players);
            break;
        case "ping":
            handlePing(parsedMessage);
            break;
        default:
            console.log(`unknown type ${parsedMessage.type}`);
            break;
    }
}

function handleBroadcast(parsedMessage: any, players: Map<string, Player>) {
    const dataBroadcast: WsPlayersCordBroadcast = parsedMessage;

    for (const cords of dataBroadcast.cords) {
        const player = players.get(cords.id);

        if (!player) {
            console.error("Could not match id with a player");
            return;
        }

        player.cords = cords.cords;
    }
}

function handleDisconnect(parsedMessage: any, players: Map<string, Player>) {
    const dataDisconnect: WsDisconnect = parsedMessage;
    players.delete(dataDisconnect.id);
}

function handleConnect(parsedMessage: any, players: Map<string, Player>) {
    const dataConnect: WsConnect = parsedMessage;
    const newPlayer = new Player(dataConnect.playerData);
    players.set(newPlayer.id, newPlayer);
}

function handlePlayersList(parsedMessage: any, players: Map<string, Player>) {
    const gameData: WsGameData = parsedMessage;

    for (const playerData of gameData.playersData) {
        const newPlayer = new Player(playerData);
        players.set(newPlayer.id, newPlayer);
    }

    for (const obstacleData of gameData.obstaclesData) {
        const newObstacle = new Obstacle(obstacleData.cords, obstacleData.size, obstacleData.color);
        obstacles.add(newObstacle);
    }
}

function handlePing(parsedMessage: any) {
    const pingData: WsPing = parsedMessage;
    latency.value = (performance.now() - pingData.timestamp) / 2;
}

export { handlePing, handlePlayersList, handleConnect, handleDisconnect, handleBroadcast, handleParsedMessage };
