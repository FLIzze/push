import { Obstacle } from "../obstacle";
import { drawObstacles } from "../utils/draw";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const obstacles = new Set<Obstacle>;

document.addEventListener("click", (e) => {
    console.log(e.x);
    console.log(e.y);
    obstacles.add(new Obstacle({ x: e.x, y: e.y }, { x: 100, y: 100 }, "red"));
});

function obstacleParameters(ctx: CanvasRenderingContext2D) {
}

function gameLoop() {
    drawObstacles(ctx, obstacles);
    requestAnimationFrame(gameLoop);
}

gameLoop();
