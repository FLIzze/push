import { WebSocketServer } from "ws";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

// const players = [];

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log(`Received from client: ${message.toString()}`);

        if (message.toString().startsWith("ping")) {
            console.log("FIRST MESSAGE");
            ws.send("pong");
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
