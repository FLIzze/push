import type { Tile } from "../../../types/types.ts";
import { drawGrid, drawPixels, drawTiles } from "../utils/draw.ts";
import { paletteContainer, setupEventListeners } from "./eventListener.ts";
import { editorState, mapEditor, tileEditor } from "./state.ts";
import { setupPalette } from "./ui/palette.ts";
import { setupTools } from "./ui/tools.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const tiles = import.meta.glob('../../tiles/*.json');

for (const path in tiles) {
    const module = await tiles[path]();
    const tile: Tile = module.default;
    mapEditor.selectedTileId = tile.id;
    mapEditor.tiles.set(tile.id, tile);
}

const baseTileSize = 50;
setupEventListeners(canvas);

setupTools();
setupPalette();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const editor = editorState.isCreatingTile ? tileEditor : mapEditor;
    editor.tileSize = baseTileSize * editor.zoomLevel;

    if (editorState.isCreatingTile) {
        paletteContainer.style.display = "block";

        drawPixels(ctx);
    } else {
        paletteContainer.style.display = "none";

        const nbrTileX = canvas.width / mapEditor.tileSize;
        const nbrTileY = canvas.height / mapEditor.tileSize;
        editor.nbrTileInGrid = { x: Math.ceil(nbrTileX), y: Math.ceil(nbrTileY) };

        drawTiles(ctx);
    }

    drawGrid(ctx, editor);

    // drawTools(ctx);
    // drawToolHover(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();
