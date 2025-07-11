import { Player } from "./player";
import { Direction } from "../types";
import { drawPlayers } from "./utils/draw.ts";
import { sendInputs } from "./websocket.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 1500;
canvas.height = 500;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const player = new Player();
const players = new Map<string, Player>;

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
    sendInputs();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers(ctx, players);

    requestAnimationFrame(gameLoop);
}

gameLoop();

export { player, players };
