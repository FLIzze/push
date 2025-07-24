import { drawGrid, drawPixels } from "../utils/draw.ts";
import { paletteContainer, setupEventListeners } from "./eventListener.ts";
import { editorState, mapEditor, tileEditor } from "./state.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// const tiles = import.meta.glob('../../tiles/*.json');
// let cX = 0;
// let cY = 0;

// for (const path in tiles) {
//     const module = await tiles[path]();
//     const tile: Tile = module.default;
//     mapEditor.tiles.set(`${cX}:${cY}`, tile)
//     cX += 1;
// }

const baseTileSize = 50;

setupEventListeners(canvas);

function gameLoop() {
    if (!editorState.isCreatingTile) {
        paletteContainer.style.display = "none";
    } else {
        paletteContainer.style.display = "block";
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (editorState.isCreatingTile) {
        tileEditor.tileSize = baseTileSize * tileEditor.zoomLevel;
        drawPixels(ctx);
    } else {
        mapEditor.tileSize = baseTileSize * mapEditor.zoomLevel;
        const nbrTileX = canvas.width / mapEditor.tileSize;
        const nbrTileY = canvas.height / mapEditor.tileSize;
        mapEditor.nbrTileInGrid = { x: nbrTileX, y: nbrTileY };

        // draw(ctx, mapEditor.nbrTileInGrid, mapEditor.tileSize);
    }

    drawGrid(ctx);

    // drawTools(ctx);
    // drawToolHover(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();
