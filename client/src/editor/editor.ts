import { drawObstacles, drawTools, drawGrid, drawToolHover } from "../utils/draw.ts";
import { handleKeypress, handleMouseDown, handleMouseMove } from "./handler.ts";
import { editorState as eS } from "./state.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

eS.tools.add({
    cords: { x: 0, y: 0 },
    size: { x: 60, y: 60 },
    label: "add",
});
eS.tools.add({
    cords: { x: 70, y: 0 },
    size: { x: 60, y: 60 },
    label: "delete",
});

document.addEventListener("keypress", (e) => {
    handleKeypress(e);
});

document.addEventListener("mousemove", (e) => {
    handleMouseMove(e);
});

document.addEventListener("mousedown", (e) => {
    handleMouseDown(e);
});

document.addEventListener("mouseup", () => {
    eS.drag = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas);
    drawObstacles(ctx);

    drawTools(ctx);
    drawToolHover(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();
