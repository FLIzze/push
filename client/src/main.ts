import { Player } from "./player";
import { Direction } from "../types";
import { drawObstacles, drawPlayers } from "./utils/draw.ts";
import { sendInputs } from "./websocket.ts";
import { Obstacle } from "./obstacle.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 1500;
canvas.height = 500;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const player = new Player();
const players = new Map<string, Player>;
const obstacles = new Set<Obstacle>;

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
    drawObstacles(ctx, obstacles);
    drawPlayers(ctx, players);

    requestAnimationFrame(gameLoop);
}

gameLoop();

export { player, players, obstacles };
