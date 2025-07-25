import { handleToolSelection } from "./events/keyboard.ts";
import { handleCanvasLeftClick, handleCanvasMouseMove, handleGlobalMouseMove, handleZoom, hidePalette, hideTools, startPaletteDragging, startToolsDragging, stopDragging } from "./events/mouse.ts";
import { saveTile } from "./utils.ts";

export const paletteDiv = document.getElementById("palette") as HTMLDivElement;
export const paletteContainer = document.getElementById("palette-container") as HTMLDivElement;
export const hidePaletteButton = document.getElementById("hide-palette") as HTMLButtonElement;

export const toolsDiv = document.getElementById("tools") as HTMLDivElement;
export const toolsContainer = document.getElementById("tools-container") as HTMLDivElement;
export const hideToolsButton = document.getElementById("hide-tools") as HTMLButtonElement;

const save = document.getElementById("save") as HTMLButtonElement;

function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function setupEventListeners(canvas: HTMLCanvasElement) {
    window.addEventListener("resize", () => resizeCanvas(canvas));

    document.addEventListener("wheel", (e) => handleZoom(e));

    document.addEventListener("mousemove", handleGlobalMouseMove);
    canvas.addEventListener("mousemove", (e) => handleCanvasMouseMove(e));

    hidePaletteButton.addEventListener("click", hidePalette);
    hideToolsButton.addEventListener("click", hideTools);
    save.addEventListener("click", saveTile);

    document.addEventListener("mouseup", stopDragging);

    canvas.addEventListener("mousedown", (e) => handleCanvasLeftClick(e));
    toolsContainer.addEventListener("mousedown", startToolsDragging);
    paletteContainer.addEventListener("mousedown", startPaletteDragging);

    document.addEventListener("keydown", handleToolSelection);
}
