import type { WsConnect, WsInputs } from "../../../types/types.ts";
import { handleParsedMessage } from "./handler.ts";
import { player, players } from "./game.ts";

const PORT = 8080;
const ws = new WebSocket(`ws://localhost:${PORT}`);

ws.onopen = () => {
    players.set(player.id, player);

    const data: WsConnect = {
        type: "connect",
        playerData: {
            id: player.id,
            size: player.size,
            cords: player.cords,
            color: player.color,
        },
    };

    ws.send(JSON.stringify(data));
};

ws.onmessage = (event) => {
    let parsedMessage: any;
    try {
        parsedMessage = JSON.parse(event.data);
    } catch (err) {
        console.error(`Error parsing message: ${err}`);
        return;
    }

    handleParsedMessage(parsedMessage, players);
};


function sendInputs() {
    if (ws.readyState !== ws.OPEN) {
        return;
    }

    const wsInputs: WsInputs = {
        type: "inputs",
        inputs: Array.from(player.inputs),
    }

    ws.send(JSON.stringify(wsInputs));
}

function sendPing() {
    const timestamp = performance.now();
    const message = JSON.stringify({ type: "ping", timestamp: timestamp });
    ws.send(message);
}

export { sendInputs, sendPing };
