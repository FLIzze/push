import type { WsConnect, WsDisconnect, WsPlayersCordBroadcast, WsPlayersList } from "../../types/types";
import { Player } from "./player";

function handleBroadcast(parsedMessage: any, players: Map<string, Player>) {
    // sent 60 times a second, all players position
    const dataBroadcast: WsPlayersCordBroadcast = parsedMessage;

    for (const cords of dataBroadcast.data) {
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
    const dataPlayerList: WsPlayersList = parsedMessage;
    for (const playerData of dataPlayerList.playersData) {
        const newPlayer = new Player(playerData);
        players.set(newPlayer.id, newPlayer);
    }
}

export { handlePlayersList, handleConnect, handleDisconnect, handleBroadcast };
