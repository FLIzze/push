import { drawButtons, drawObstacleParameters, drawOutlines, drawObstacles } from "../utils/draw.ts";
import { getButtonUnderMouse, getObstacleUnderMouse, handleLeftClick, handleMiddleClick, handleMouseMove, handleMouseUp } from "./handler.ts";
import { editorState as eS } from "./state.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("mousemove", (e) => {
    handleMouseMove(e);
});

document.addEventListener("mouseup", () => {
    handleMouseUp();
});

document.addEventListener("mousedown", (e) => {
    switch (e.button) {
        case 0:
            handleLeftClick(e);
            break;
        case 1:
            handleMiddleClick();
            break;
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    eS.buttons.clear();

    drawObstacles(ctx, eS.obstacles);

    if (eS.selectedObstacle.value) {
        drawObstacleParameters(eS.selectedObstacle.value, ctx, eS.buttons);
    }

    if (!eS.selectedObstacle.value) {
        const hoveredObstacle = getObstacleUnderMouse();
        if (hoveredObstacle) drawOutlines(hoveredObstacle, ctx);
    }

    if (eS.buttons.size > 0) {
        drawButtons(eS.buttons, ctx);
    }

    if (eS.drag.value) {
        canvas.style.cursor = "grabbing";
    } else if (getButtonUnderMouse()) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
