import { Player } from "./player";
import { Direction } from "../types";
import { drawObstacles, drawPlayers } from "./utils/draw.ts";
import { Obstacle } from "./obstacle.ts";
import { sendInputs } from "./websocket.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 1500;
canvas.height = 500;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const player = new Player();
const players = new Map<string, Player>;
const obstacles = new Set<Obstacle>;

document.addEventListener("keydown", (e) => {
    let changed = false;

    if (e.key === "a" && !player.inputs.has(Direction.Left)) {
        player.inputs.add(Direction.Left)
        changed = true;
    };

    if (e.key === "d" && !player.inputs.has(Direction.Right)) {
        player.inputs.add(Direction.Right)
        changed = true;
    };

    if (e.key === " " && !player.inputs.has(Direction.Up)) {
        player.inputs.add(Direction.Up)
        changed = true;
    };

    if (changed) {
        sendInputs();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a") {
        player.inputs.delete(Direction.Left)
        sendInputs();
    };

    if (e.key === "d") {
        player.inputs.delete(Direction.Right)
        sendInputs();
    };

    if (e.key === " ") {
        player.inputs.delete(Direction.Up)
        sendInputs();
    };
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObstacles(ctx, obstacles);
    drawPlayers(ctx, players);

    requestAnimationFrame(gameLoop);
}

gameLoop();

export { player, players, obstacles };
