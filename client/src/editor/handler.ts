import { editorState as eS } from "./state.ts";
import type { Obstacle } from "../../types.ts";
import { addObstacle, deleteObstacle, returnObstacleUnderMouse } from "./utils.ts";

function handleLeftClick(e: MouseEvent) {
    eS.drag = true;
    const scale = eS.scale * eS.gridSize;
    eS.lastMousePos.x = Math.floor(e.x / scale);
    eS.lastMousePos.y = Math.floor(e.y / scale);

    switch (eS.tool) {
        case "add":
            const newObstacle: Obstacle = {
                cords: { x: eS.mousePos.x, y: eS.mousePos.y },
                color: "red",
            };

            addObstacle(newObstacle);
            break;
        case "delete":
            const obstacle = returnObstacleUnderMouse();
            if (obstacle) {
                deleteObstacle(obstacle);
            }
            break;
        default:
            break;
    }
}

function handleMouseDown(e: MouseEvent) {
    switch (e.button) {
        case 0:
            handleLeftClick(e);
            break;
        default:
            break;
    }
}

function handleKeypress(e: KeyboardEvent) {
    switch (e.key) {
        case "a":
            eS.tool = "add";
            break;
        case "d":
            eS.tool = "delete";
            break;
        default:
            break;
    }
}

function handleMouseMove(e: MouseEvent) {
    const scale = eS.scale * eS.gridSize;
    const newX = Math.floor(e.x / scale);
    const newY = Math.floor(e.y / scale);

    const prev = eS.lastMousePos;
    eS.mousePos = { x: newX, y: newY };

    if (!eS.drag) {
        eS.lastMousePos = { ...eS.mousePos };
        return;
    }

    // Bresenham grid fill
    const dx = Math.abs(newX - prev.x);
    const dy = Math.abs(newY - prev.y);
    const sx = newX > prev.x ? 1 : -1;
    const sy = newY > prev.y ? 1 : -1;

    let x = prev.x;
    let y = prev.y;

    let err = dx - dy;

    while (true) {
        const currentPos = { x, y };
        if (eS.tool === "add") {
            addObstacle({ cords: currentPos, color: "red" });
        } else if (eS.tool === "delete") {
            const obstacle = returnObstacleUnderMouse();
            if (obstacle) {
                deleteObstacle(obstacle);
            }
        }

        if (x === newX && y === newY) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }

    eS.lastMousePos = { x: newX, y: newY };
}

export { handleKeypress, handleLeftClick, handleMouseMove, handleMouseDown };
