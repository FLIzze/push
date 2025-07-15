import { WebSocketServer } from "ws";

function broadcast(message: string, wss: WebSocketServer) {
    for (const client of wss.clients) {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    }
}

export { broadcast };
