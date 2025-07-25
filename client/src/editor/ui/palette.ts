import type { Tile } from "../../../../types/types";
import { paletteContainer, paletteDiv } from "../eventListener";
import { handlePaletteColorClick, handlePaletteTileClick } from "../events/mouse";
import { editorState, mapEditor, palette } from "../state";

export async function setupPalette() {
    paletteDiv.innerHTML = "";

    paletteContainer.style.left = `${palette.coords.x}px`;
    paletteContainer.style.top = `${palette.coords.y}px`;

    palette.content = [];

    if (editorState.isCreatingTile) {
        renderColorPalette();
    } else {
        renderTilePalette();
    }
}

function renderColorPalette() {
    palette.type = "color";
    const content = [
        "#330000", "#660000", "#990000", "#CC0000", "#FF0000", "#FF6666",
        "#FF9999", "#FFE5E5", "#331A00", "#663300", "#994D00", "#CC6600",
        "#FF8000", "#FFA64D", "#FFCC99", "#FFF2E5", "#333300", "#666600",
        "#999900", "#CCCC00", "#FFFF00", "#FFFF66", "#FFFF99", "#FFFFE5",
        "#003300", "#006600", "#009900", "#00CC00", "#00FF00", "#66FF66",
        "#99FF99", "#E5FFE5", "#003333", "#006666", "#009999", "#00CCCC",
        "#00FFFF", "#66FFFF", "#99FFFF", "#E5FFFF", "#000033", "#000066",
        "#000099", "#0000CC", "#0000FF", "#6666FF", "#9999FF", "#E5E5FF",
        "#1A0033", "#330066", "#4D0099", "#6600CC", "#8000FF", "#A64DFF",
        "#CC99FF", "#F2E5FF", "#33001A", "#660033", "#99004D", "#CC0066",
        "#FF007F", "#FF66A3", "#FFB3CC", "#FFE5F2", "#000000", "#333333",
        "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F2F2F2", "#FFFFFF"
    ]

    palette.content = content;

    for (const color of palette.content) {
        const button = document.createElement("button");

        button.classList.add("palette-color");
        button.style.backgroundColor = color;

        button.addEventListener("click", () => handlePaletteColorClick(button, color));
        paletteDiv.appendChild(button);
    }
}

async function renderTilePalette() {
    palette.type = "tile";

    const tiles = import.meta.glob("../../../tiles/*.json");
    const content: string[] = [];

    for (const path in tiles) {
        const module = await tiles[path]();
        const tile: Tile = module.default;

        mapEditor.selectedTileId = tile.id;
        mapEditor.tiles.set(tile.id, tile);
        content.push(tile.id);
    }

    palette.content = content;

    for (const id of palette.content) {
        const tile = mapEditor.tiles.get(id);

        if (!tile) return;
        const canvas = renderTileToCanvas(tile);
        paletteDiv.appendChild(canvas);
    }
}

function renderTileToCanvas(tile: Tile, size = 200): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.classList.add("palette-canvas");

    canvas.addEventListener("click", () => handlePaletteTileClick(canvas, tile.id));

    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    const length = tile.pixels.length;
    const pixelSize = size / length;

    for (let y = 0; y < length; y++) {
        for (let x = 0; x < length; x++) {
            const color = tile.pixels[y][x];
            if (!color) continue;

            ctx.fillStyle = color;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    return canvas;
}
