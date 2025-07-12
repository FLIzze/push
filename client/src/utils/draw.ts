import type { Obstacle } from "../obstacle";
import type { Player } from "../player";

function drawPlayers(ctx: CanvasRenderingContext2D, players: Map<string, Player>) {
    for (const player of players.values()) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.cords.x, player.cords.y, player.size.x, player.size.y);
    }
}

function drawObstacles(ctx: CanvasRenderingContext2D, obstacles: Set<Obstacle>) {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.cords.x, obstacle.cords.y, obstacle.size.x, obstacle.size.y);
    });
}

export { drawPlayers, drawObstacles };
