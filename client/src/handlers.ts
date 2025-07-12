import type { WsConnect, WsDisconnect, WsPlayersCordBroadcast, WsGameData } from "../../types/types";
import { obstacles } from "./main";
import { Obstacle } from "./obstacle";
import { Player } from "./player";

function handleBroadcast(parsedMessage: any, players: Map<string, Player>) {
    // sent 60 times a second, all players position
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

export { handlePlayersList, handleConnect, handleDisconnect, handleBroadcast };
