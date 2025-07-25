import { drawGrid, drawPixels, drawTiles } from "../utils/draw.ts";
import { setupEventListeners } from "./eventListener.ts";
import { editorConfig, editorState, mapEditor, tileEditor } from "./state.ts";
import { setupPalette } from "./ui/palette.ts";
import { setupTools } from "./ui/tools.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

setupEventListeners(canvas);

setupTools();
await setupPalette();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const editor = editorState.isCreatingTile ? tileEditor : mapEditor;
    editor.tileSize = editorConfig.tileSize * editor.zoomLevel;

    if (editorState.isCreatingTile) {
        drawPixels(ctx);
    } else {
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
