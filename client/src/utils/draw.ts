import type { Player } from "../game/player.ts";
import { editorState as eS } from "../editor/state.ts";

function drawPlayers(ctx: CanvasRenderingContext2D, players: Map<string, Player>) {
    for (const player of players.values()) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.cords.x, player.cords.y, player.size.x, player.size.y);
    }
}

function drawObstacles(ctx: CanvasRenderingContext2D) {
    for (const obstacle of eS.obstacles.values()) {
        ctx.fillStyle = obstacle.color;
        const sizeScale = eS.gridSize * eS.scale;
        ctx.fillRect(obstacle.cords.x * sizeScale, obstacle.cords.y * sizeScale, sizeScale, sizeScale);
    };
}

function drawTools(ctx: CanvasRenderingContext2D) {
    ctx.font = "16px Arial";

    for (const tool of eS.tools.values()) {
        ctx.fillStyle = "black";
        ctx.fillRect(tool.cords.x, tool.cords.y, tool.size.x, tool.size.y);
        ctx.fillStyle = "red";
        ctx.fillText(tool.label, tool.cords.x, tool.cords.y + 20);
    }
}

function drawToolHover(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "blue";

    for (const tool of eS.tools) {
        if (tool.label === eS.tool) {
            ctx.fillRect(
                tool.cords.x,
                tool.cords.y + tool.size.y,
                tool.size.x,
                5
            );
        }
    }
}

function drawGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    const size = eS.gridSize * eS.scale;

    for (let x = 0; x <= canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}


export { drawGrid, drawPlayers, drawObstacles, drawTools, drawToolHover };
