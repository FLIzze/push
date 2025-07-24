import type { Player } from "../game/player.ts";
import { editorState, mapEditor, tileEditor } from "../editor/state.ts";

function drawPlayers(ctx: CanvasRenderingContext2D, players: Map<string, Player>) {
    for (const player of players.values()) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.cords.x, player.cords.y, player.size.x, player.size.y);
    }
}

export function drawPixels(ctx: CanvasRenderingContext2D) {
    const size = tileEditor.tileSize;
    const arr = tileEditor.pixels;

    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            if (arr[y][x] === null) continue;

            ctx.fillStyle = arr[y][x];
            ctx.fillRect(x * size, y * size, size, size);
        }
    }
}

export function drawTiles(ctx: CanvasRenderingContext2D) {
    // for (const tile of eS.tiles.entries()) {
    //     const cords = tile[0].split(":");
    //     const pixelsArr = eS.temporaryTile.get(tile[1]);
    //     if (!pixelsArr) return;

    //     let gridPositionX = Number(cords[0]) * eS.tileSize;
    //     let gridPositionY = Number(cords[1]) * eS.tileSize;

    //     for (const x of pixelsArr) {
    //         for (const y of x) {
    //             ctx.fillStyle = y;

    //             ctx.fillRect(
    //                 gridPositionX,
    //                 gridPositionY,
    //                 eS.tileSize / 16,
    //                 eS.tileSize / 16,
    //             );

    //             gridPositionX += eS.tileSize / 16;
    //         }
    //         gridPositionX = Number(cords[0]) * eS.tileSize;
    //         gridPositionY += eS.tileSize / 16;
    //     }

    // }
}

function drawTools(ctx: CanvasRenderingContext2D) {
    // ctx.font = "16px Arial";

    // for (const tool of eS.tools.values()) {
    //     ctx.fillStyle = "yellow";
    //     ctx.fillRect(tool.cords.x, tool.cords.y, tool.size.x, tool.size.y);
    //     ctx.fillStyle = "red";
    //     ctx.fillText(tool.label, tool.cords.x, tool.cords.y + 20);
    // }
    // }

    // function drawButtons(ctx: CanvasRenderingContext2D) {
    // ctx.font = "16px Arial";

    // for (const button of eS.buttons) {
    //     ctx.fillStyle = "yellow";
    //     ctx.fillRect(button.cords.x, button.cords.y, button.size.x, button.size.y);
    //     ctx.fillStyle = "red";
    //     ctx.fillText(button.label, button.cords.x, button.cords.y + 20);
    // }
}

function drawToolHover(ctx: CanvasRenderingContext2D) {
    // ctx.fillStyle = "blue";

    // for (const tool of eS.tools) {
    //     if (tool.label === eS.tool) {
    //         ctx.fillRect(
    //             tool.cords.x,
    //             tool.cords.y + tool.size.y,
    //             tool.size.x,
    //             5
    //         );
    //     }
    // }
}

function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    let size = 0;
    let nbrTile = { x: 0, y: 0 };

    if (editorState.isCreatingTile) {
        size = tileEditor.tileSize;
        nbrTile = tileEditor.nbrTileInGrid;
    } else {
        size = mapEditor.tileSize;
        nbrTile = mapEditor.nbrTileInGrid;
    }

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

export function drawAvailableTiles(ctx: CanvasRenderingContext2D) {
    for (const tile of eS.availableTiles.entries()) {
        const cords = tile[0].split(":");
        const pixelsArr = tile[1];

        let gridPositionX = Number(cords[0]) * eS.tileSize;
        let gridPositionY = Number(cords[1]) * eS.tileSize;

        for (const x of pixelsArr.pixels) {
            for (const y of x) {
                ctx.fillStyle = y;

                ctx.fillRect(
                    gridPositionX,
                    gridPositionY,
                    eS.tileSize / 16,
                    eS.tileSize / 16,
                );

                gridPositionX += eS.tileSize / 16;
            }
            gridPositionX = Number(cords[0]) * eS.tileSize;
            gridPositionY += eS.tileSize / 16;
        }

    }
}

export { drawGrid, drawPlayers, drawTools, drawToolHover };
