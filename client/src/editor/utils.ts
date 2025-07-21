import type { Obstacle } from "../../types";
import { editorState as eS } from "./state";

function addObstacle(newObstacle: Obstacle) {
    for (const obstacle of eS.obstacles) {
        if (newObstacle.cords.x === obstacle.cords.x && newObstacle.cords.y === obstacle.cords.y) {
            return;
        }
    }

    eS.obstacles.add(newObstacle);
}

function returnObstacleUnderMouse(): Obstacle | null {
    for (const obstacle of eS.obstacles) {
        if (obstacle.cords.x === eS.mousePos.x && obstacle.cords.y === eS.mousePos.y) {
            return obstacle;
        }
    }

    return null;
}

function deleteObstacle(obstacle: Obstacle) {
    eS.obstacles.delete(obstacle);
}

export { addObstacle, returnObstacleUnderMouse, deleteObstacle };
