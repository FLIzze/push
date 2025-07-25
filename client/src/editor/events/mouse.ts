import { hidePaletteButton, hideToolsButton, paletteContainer, paletteDiv, toolsContainer, toolsDiv } from "../eventListener";
import { editorState, mapEditor, palette, tileEditor, tools } from "../state";

export function handleCanvasLeftClick(e: MouseEvent) {
    if (e.button !== 0) return; // 0 is left click

    const cX = editorState.mousePos.x;
    const cY = editorState.mousePos.y;

    const isClickingOnGrid = (
        cX < tileEditor.nbrTileInGrid.x && cY < tileEditor.nbrTileInGrid.y
    );

    switch (editorState.selectedTool) {
        case "add":
            if (editorState.isCreatingTile && isClickingOnGrid && tileEditor.selectedColor !== "") {
                tileEditor.pixels[cY][cX] = tileEditor.selectedColor;
            } else {
                mapEditor.placedTiles.set(`${cX}:${cY}`, mapEditor.selectedTileId);
            }
            break;
        case "delete":
            if (editorState.isCreatingTile && isClickingOnGrid) {
                tileEditor.pixels[cY][cX] = null;
            } else {
                mapEditor.placedTiles.delete(`${cX}:${cY}`);
            }
            break;
        default:
            break;
    }
}

export function handleMouseMove(e: MouseEvent) {
    const editor = editorState.isCreatingTile ? tileEditor : mapEditor;

    editorState.mousePos.x = Math.floor(e.clientX / editor.tileSize);
    editorState.mousePos.y = Math.floor(e.clientY / editor.tileSize);

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
}

export function hideTools() {
    tools.visible = !tools.visible;
    toolsDiv.style.display = tools.visible ? "block" : "none";
    hideToolsButton.textContent = tools.visible ? "hide" : "show";
}

export function hidePalette() {
    palette.visible = !palette.visible;
    paletteDiv.style.display = palette.visible ? "grid" : "none";
    hidePaletteButton.textContent = palette.visible ? "hide" : "show";
}

export function startToolsDragging(e: MouseEvent) {
    tools.isDragging = true;
    tools.offset.x = e.clientX - tools.coords.x;
    tools.offset.y = e.clientY - tools.coords.y;
}

export function startPaletteDragging(e: MouseEvent) {
    palette.isDragging = true;
    palette.offset.x = e.clientX - palette.coords.x;
    palette.offset.y = e.clientY - palette.coords.y;
}

export function stopDragging() {
    palette.isDragging = false;
    tools.isDragging = false;
}

export function handleZoom(e: WheelEvent) {
    const zoomStrength = 0.05;
    const zoom = e.deltaY < 0 ? zoomStrength : -zoomStrength;
    const editor = editorState.isCreatingTile ? tileEditor : mapEditor;

    editor.zoomLevel = Math.max(0.1, Math.min(5, editor.zoomLevel + zoom));
}
