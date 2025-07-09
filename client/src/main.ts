import {Player} from "./player";
import {Direction} from "../types";

const PORT = 8080;
const HOST = "localhost";

const ws = new WebSocket(`ws://${HOST}:${PORT}`);

const player = new Player({width: 30, height: 50}, "red");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 1500;
canvas.height = 500;

document.addEventListener("keydown", (e) => {
    if (e.key === "a") player.startMove(Direction.Left);
    if (e.key === "d") player.startMove(Direction.Right);
    if (e.key === " ") player.startMove(Direction.Up)
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a") player.stopMove(Direction.Left);
    if (e.key === "d") player.stopMove(Direction.Right);
    if (e.key === " ") player.stopMove(Direction.Up)
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.applyGravity(ctx);
    player.draw(ctx);

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(player.cords));
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
