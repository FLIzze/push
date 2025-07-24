import { editorState, mapEditor, palette, tileEditor, tools } from "./state.ts";
import { addTile } from "./utils.ts";

const paletteDiv = document.getElementById("palette") as HTMLDivElement;
export const paletteContainer = document.getElementById("palette-container") as HTMLDivElement;
const hidePaletteButton = document.getElementById("hide-palette") as HTMLButtonElement;

const toolsDiv = document.getElementById("tools") as HTMLDivElement;
export const toolsContainer = document.getElementById("tools-container") as HTMLDivElement;
const hideToolsButton = document.getElementById("hide-tools") as HTMLButtonElement;

function handleCanvasLeftClick(e: MouseEvent) {
    if (e.button !== 0) return; // 0 is left click

    // eS.drag = true;
    // let scale: number = 0;

    // eS.lastMousePos.x = Math.floor(e.clientX / scale);
    // eS.lastMousePos.y = Math.floor(e.clientY / scale);

    // if (eS.tileCreation) {
    //     const pixel = returnColorUnderMouse();
    //     if (pixel) {
    //         eS.color = pixel.color;
    //     }

    //     const button = returnButtonUnderMouse();
    //     if (button) {
    //         button.onClick();
    //     }
    // } else {
    // for (const availableTile of eS.availableTiles.entries()) {
    //     const cords = availableTile[0].split(":");

    //     if (Number(cords[0]) === eS.mousePos.x && Number(cords[1]) === eS.mousePos.y) {
    //         eS.tile = availableTile[1].id;
    //         return;
    //     }
    // }
    // }

    switch (editorState.selectedTool) {
        case "add":
            if (editorState.isCreatingTile) {
                const cX = editorState.mousePos.x;
                const cY = editorState.mousePos.y;

                if (cX >= tileEditor.nbrTileInGrid.x || cY >= tileEditor.nbrTileInGrid.y) return;

                tileEditor.pixels[cY][cX] = tileEditor.selectedColor;
            } else {
                addTile(editorState.mousePos);
            }
            break;
        case "delete":
            if (editorState.isCreatingTile) {
                const cX = editorState.mousePos.x;
                const cY = editorState.mousePos.y;

                if (
                    cX >= tileEditor.nbrTileInGrid.x ||
                    cY >= tileEditor.nbrTileInGrid.y
                ) return;

                tileEditor.pixels[cY][cX] = null;
            } else {
                // deleteTile(eS.mousePos);
            }
            break;
        default:
            break;
    }
}

export function handleToolSelection(e: KeyboardEvent) {
    switch (e.key) {
        case "a":
            editorState.selectedTool = "add";
            break;
        case "d":
            editorState.selectedTool = "delete";
            break;
        case "c":
            editorState.isCreatingTile = !editorState.isCreatingTile;
            break;
        default:
            break;
    }
}

function handleMouseMove(e: MouseEvent) {
    if (tileEditor) {
        editorState.mousePos.x = Math.floor(e.clientX / tileEditor.tileSize);
        editorState.mousePos.y = Math.floor(e.clientY / tileEditor.tileSize);
    } else {
        editorState.mousePos.x = Math.floor(e.clientX / mapEditor.tileSize);
        editorState.mousePos.y = Math.floor(e.clientY / mapEditor.tileSize);
    }

    if (palette.isDragging) {
        palette.coords.x = e.clientX - palette.offset.x;
        palette.coords.y = e.clientY - palette.offset.y;

        paletteContainer.style.left = `${palette.coords.x}px`;
        paletteContainer.style.top = `${palette.coords.y}px`;
    }

    if (tools.isDragging) {
        tools.coords.x = e.clientX - tools.offset.x;
        tools.coords.y = e.clientY - tools.offset.y;

        toolsContainer.style.left = `${tools.coords.x}px`;
        toolsContainer.style.top = `${tools.coords.y}px`;
    }

    // const prev = eS.lastMousePos;
    // eS.mousePos = { x: newX, y: newY };

    // if (!eS.drag) {
    //     eS.lastMousePos = { ...eS.mousePos };
    //     return;
    // }

    // // Bresenham's line algorithm between prev and new mouse position
    // let x = prev.x;
    // let y = prev.y;

    // const dx = Math.abs(newX - x);
    // const dy = Math.abs(newY - y);
    // const sx = x < newX ? 1 : -1;
    // const sy = y < newY ? 1 : -1;

    // let err = dx - dy;

    // while (true) {
    //     const currentPos = { x, y };

    //     if (x < 0 || y < 0 || x >= eS.gridSize || y >= eS.gridSize) break;

    //     if (eS.tool === "add") {
    //         if (eS.tileCreation) {
    //             addPixel({ cords: currentPos, color: eS.color });
    //         } else {
    //             addTile(currentPos);
    //         }
    //     } else if (eS.tool === "delete") {
    //         if (eS.tileCreation) {
    //             const pixel = [...eS.pixels].find(p => p.cords.x === x && p.cords.y === y);
    //             if (pixel) deletePixel(pixel);
    //         } else {
    //             deleteTile(eS.mousePos);
    //         }
    //     }

    //     if (x === newX && y === newY) break;

    //     const e2 = 2 * err;
    //     if (e2 > -dy) {
    //         err -= dy;
    //         x += sx;
    //     }
    //     if (e2 < dx) {
    //         err += dx;
    //         y += sy;
    //     }
    // }

    // eS.lastMousePos = { x: newX, y: newY };
}

function applyBresenhamLine() {
    const { lastMousePos, mousePos, selectedTool, isCreatingTile } = editorState;

    let x0 = lastMousePos.x;
    let y0 = lastMousePos.y;
    const x1 = mousePos.x;
    const y1 = mousePos.y;

    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;

    let err = dx + dy;

    while (true) {
        if (
            x0 >= 0 && y0 >= 0 &&
            x0 < tileEditor.nbrTileInGrid.x &&
            y0 < tileEditor.nbrTileInGrid.y
        ) {
            if (isCreatingTile) {
                if (selectedTool === "add") {
                    tileEditor.pixels[y0][x0] = tileEditor.selectedColor;
                } else if (selectedTool === "delete") {
                    tileEditor.pixels[y0][x0] = null;
                }
            } else {
                if (selectedTool === "add") {
                    addTile({ x: x0, y: y0 });
                }
                // else if (selectedTool === "delete") {
                //     deleteTile({ x: x0, y: y0 }); // if implemented
                // }
            }
        }

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;

        if (e2 >= dy) {
            err += dy;
            x0 += sx;
        }

        if (e2 <= dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function hideTools() {
    tools.visible = !tools.visible;
    toolsDiv.style.display = tools.visible ? "block" : "none";
    hideToolsButton.textContent = tools.visible ? "hide" : "show";
}

function hidePalette() {
    palette.visible = !palette.visible;
    paletteDiv.style.display = palette.visible ? "block" : "none";
    hidePaletteButton.textContent = palette.visible ? "hide" : "show";
}

function startToolsDragging(e: MouseEvent) {
    tools.isDragging = true;
    tools.offset.x = e.clientX - tools.coords.x;
    tools.offset.y = e.clientY - tools.coords.y;
}

function startPaletteDragging(e: MouseEvent) {
    palette.isDragging = true;
    palette.offset.x = e.clientX - palette.coords.x;
    palette.offset.y = e.clientY - palette.coords.y;
}

function stopDragging() {
    palette.isDragging = false;
    tools.isDragging = false;
}

export function setupEventListeners(canvas: HTMLCanvasElement) {
    document.addEventListener("keydown", handleToolSelection);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("wheel", (e) => handleZoom(e));
    document.addEventListener("mouseup", stopDragging);

    canvas.addEventListener("mousedown", (e) => handleCanvasLeftClick(e));

    hidePaletteButton.addEventListener("click", hidePalette);
    hideToolsButton.addEventListener("click", hideTools);

    toolsContainer.addEventListener("mousedown", startToolsDragging);
    paletteContainer.addEventListener("mousedown", startPaletteDragging);

}

function handleZoom(e: WheelEvent) {
    const zoomStrength = 0.05;

    if (e.deltaY < 0) {
        if (editorState.isCreatingTile) {
            tileEditor.zoomLevel += zoomStrength;
        } else {
            mapEditor.zoomLevel += zoomStrength;
        }
    } else {
        if (editorState.isCreatingTile) {
            tileEditor.zoomLevel -= zoomStrength;
        } else {
            mapEditor.zoomLevel -= zoomStrength;
        }
    }
}

paletteContainer.style.left = `${palette.coords.x}px`;
paletteContainer.style.top = `${palette.coords.y}px`;

toolsContainer.style.left = `${tools.coords.x}px`;
toolsContainer.style.top = `${tools.coords.y}px`;

for (const gradient of palette.colors) {
    for (const color of gradient) {
        const button = document.createElement("button");

        button.style.border = "none";
        button.style.backgroundColor = color;
        button.style.cursor = "pointer";
        button.style.width = `${palette.buttonSize}px`;
        button.style.height = `${palette.buttonSize}px`;

        button.addEventListener("click", () => {
            tileEditor.selectedColor = color;
        });

        paletteDiv.appendChild(button);
    }
}

for (const tool of tools.tools) {
    const button = document.createElement("button");

    button.style.cursor = "pointer";
    button.style.marginTop = "8px";
    button.style.display = "flex";
    button.textContent = tool.name;
    button.title = `${tool.name} (${tool.shortcut})`;

    button.addEventListener("click", () => {
        editorState.selectedTool = tool.name
    });


    toolsDiv.appendChild(button);
}

export { handleCanvasLeftClick, handleMouseMove };
