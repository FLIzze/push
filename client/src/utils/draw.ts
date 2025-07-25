import type { Player } from "../game/player.ts";
import { editorConfig, mapEditor, tileEditor } from "../editor/state.ts";

export function drawPlayers(ctx: CanvasRenderingContext2D, players: Map<string, Player>) {
    for (const player of players.values()) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.cords.x, player.cords.y, player.size.x, player.size.y);
    }
}

export function drawPixels(ctx: CanvasRenderingContext2D) {
    if (tileEditor.selectedColor === "") return;

    const size = tileEditor.tileSize;
    const pixels = tileEditor.pixels;

    for (let y = 0; y < pixels.length; y++) {
        for (let x = 0; x < pixels[y].length; x++) {
            if (pixels[y][x] === null) continue;

            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(x * size, y * size, size, size);
        }
    }
}

export function drawTiles(ctx: CanvasRenderingContext2D) {
    const pixelSize = mapEditor.tileSize / editorConfig.resolution;

    for (const tile of mapEditor.placedTiles.entries()) {
        const coords = tile[0];
        const id = tile[1];

        const splittedCoords = coords.split(":");
        const cX = Math.ceil(Number(splittedCoords[0]) * mapEditor.tileSize);
        const cY = Math.ceil(Number(splittedCoords[1]) * mapEditor.tileSize);

        const selectedTile = mapEditor.tiles.get(id);
        if (!selectedTile) return;

        const pixels = selectedTile.pixels;
        const length = pixels.length;

        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                const color = pixels[y][x];
                if (!color) continue;

                ctx.fillStyle = pixels[y][x];
                ctx.fillRect(cX + x * pixelSize, cY + y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

export function drawGrid(ctx: CanvasRenderingContext2D, editor: typeof tileEditor | typeof mapEditor) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    let size = 0;
    let nbrTile = { x: 0, y: 0 };

    size = editor.tileSize;
    nbrTile = editor.nbrTileInGrid;

    for (let x = 0; x <= nbrTile.x; x++) {
        ctx.beginPath();
        ctx.moveTo(x * size, 0);
        ctx.lineTo(x * size, nbrTile.y * size);
        ctx.stroke();
    }

    for (let y = 0; y <= nbrTile.y; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * size);
        ctx.lineTo(nbrTile.x * size, y * size);
        ctx.stroke();
    }
}
