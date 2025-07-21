import type { Tool } from "../../../types/types";
import type { Obstacle } from "../../types";

export const editorState = {
    lastMousePos: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 },
    drag: false,
    selectedObstacle: null as Obstacle | null,
    tool: "add" as "add" | "delete",
    tools: new Set<Tool>(),
    obstacles: new Set<Obstacle>(),
    gridSize: 16,
    scale: 2,
};
