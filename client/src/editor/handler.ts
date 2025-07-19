import type { Button, Tool } from "../../../types/types";
import { Obstacle } from "../obstacle";
import { editorState as eS } from "./state.ts";

function handleLeftClick(e: MouseEvent) {
    const tool = getToolUnderMouse();
    if (tool && tool.label) {
        eS.tool.value = tool.label;
        return;
    }

    switch (eS.tool.value) {
        case "add":
            const newObstacle = new Obstacle({ x: e.x, y: e.y }, { x: 200, y: 200 }, "red");
            eS.obstacles.add(newObstacle);
            break;
        case "delete":
            const obstacle = getObstacleUnderMouse();
            if (obstacle) {
                eS.obstacles.delete(obstacle);
                eS.selectedObstacle.value = null;
            }
            break;
        case "edit":
            if (handleButtonClick()) return;

            const obstacle2 = getObstacleUnderMouse();
            if (obstacle2) {
                eS.selectedObstacle.value = obstacle2;
                return;
            }

            if (eS.selectedObstacle.value) {
                eS.selectedObstacle.value = null;
                return;
            }
            break;
        default:
            break;
    }

}

function handleButtonClick(): boolean {
    for (const button of eS.buttons) {
        if (isPointInside(eS.mousePos, button.cords, button.size)) {
            button.onClick();
            return true;
        }
    }
    return false;
}

function isPointInside(
    point: { x: number; y: number },
    topLeft: { x: number; y: number },
    size: { x: number; y: number }
): boolean {
    return (
        point.x > topLeft.x &&
        point.x < topLeft.x + size.x &&
        point.y > topLeft.y &&
        point.y < topLeft.y + size.y
    );
}

function getObstacleUnderMouse(): Obstacle | null {
    for (const obstacle of eS.obstacles) {
        if (isPointInside(eS.mousePos, obstacle.cords, obstacle.size)) {
            return obstacle;
        }
    }
    return null;
}

function getToolUnderMouse(): Tool | null {
    for (const tool of eS.tools) {
        if (isPointInside(eS.mousePos, tool.cords, tool.size)) {
            return tool;
        }
    }
    return null;
}

function getButtonUnderMouse(): Button | null {
    for (const button of eS.buttons) {
        if (isPointInside(eS.mousePos, button.cords, button.size)) {
            return button;
        }
    }
    return null;
}

function handleMouseUp() {
    if (eS.drag.value) eS.drag.value = false;

    if (eS.resizeDirection.value) {
        eS.resizeDirection.value = null;
        eS.resizeOffset.x = 0;
        eS.resizeOffset.y = 0;
    }
}

function handleKeypress(e: KeyboardEvent) {
    switch (e.key) {
        case "a":
            eS.tool.value = "add";
            break;
        case "d":
            eS.tool.value = "delete";
            break;
        case "e":
            eS.tool.value = "edit";
            break;
        default:
            break;
    }
}

function handleMouseMove(e: MouseEvent) {
    eS.mousePos.x = e.x;
    eS.mousePos.y = e.y;

    if (eS.selectedObstacle.value && eS.drag.value) {
        eS.selectedObstacle.value.cords.x = eS.mousePos.x - eS.dragOffset.x;
        eS.selectedObstacle.value.cords.y = eS.mousePos.y - eS.dragOffset.y;
    }

    if (!eS.selectedObstacle.value || !eS.resizeDirection.value) return;

    const dx = eS.mousePos.x - eS.resizeOffset.x;
    const dy = eS.mousePos.y - eS.resizeOffset.y;

    switch (eS.resizeDirection.value) {
        case "right":
            eS.selectedObstacle.value.size.x = Math.max(10, eS.selectedObstacle.value.size.x + dx);
            eS.resizeOffset.x = eS.mousePos.x;
            break;
        case "left":
            const newWidth = eS.selectedObstacle.value.size.x - dx;
            if (newWidth >= 10) {
                eS.selectedObstacle.value.cords.x += dx;
                eS.selectedObstacle.value.size.x = newWidth;
                eS.resizeOffset.x = eS.mousePos.x;
            }
            break;
        case "bottom":
            eS.selectedObstacle.value.size.y = Math.max(10, eS.selectedObstacle.value.size.y + dy);
            eS.resizeOffset.y = eS.mousePos.y;
            break;
        case "top":
            const newHeight = eS.selectedObstacle.value.size.y - dy;
            if (newHeight >= 10) {
                eS.selectedObstacle.value.cords.y += dy;
                eS.selectedObstacle.value.size.y = newHeight;
                eS.resizeOffset.y = eS.mousePos.y;
            }
            break;
        default:
            console.error(`ResizeDirection ${eS.resizeDirection.value} does not exist.`);
            break;
    }
}

export { handleKeypress, handleLeftClick, handleMouseMove, handleMouseUp, getObstacleUnderMouse, getButtonUnderMouse, getToolUnderMouse };
