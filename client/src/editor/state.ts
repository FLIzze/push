import type { Button, Tool } from "../../../types/types";
import { Obstacle } from "../obstacle";

export const editorState = {
    mousePos: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    resizeOffset: { x: 0, y: 0 },
    drag: { value: false },
    resizeDirection: { value: null as "left" | "top" | "right" | "bottom" | null },
    selectedObstacle: { value: null as Obstacle | null },
    tool: { value: "" as "edit" | "delete" | "add" },
    tools: new Set<Tool>(),
    buttons: new Set<Button>(),
    obstacles: new Set<Obstacle>(),
};
