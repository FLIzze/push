import {Player} from "./player";

const player = new Player(30, 50, "red");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 1500;
canvas.height = 500;

document.addEventListener("keydown", (e) => {
    if (e.key === "a") player.startMove("left");
    if (e.key === "d") player.startMove("right");
    if (e.key === " ") player.startMove("jump")
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a") player.stopMove("left");
    if (e.key === "d") player.stopMove("right");
    if (e.key === " ") player.stopMove("jump")
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.applyGravity(ctx);
    player.draw(ctx);
    requestAnimationFrame(gameLoop);
}

gameLoop();
