import type { Obstacle } from "../obstacle.ts";
import type { Player } from "../game/player.ts";
import type { Button } from "../../../types/types.ts";
import { editorState as eS } from "../editor/state.ts";

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


function drawObstacleParameters(obstacle: Obstacle, ctx: CanvasRenderingContext2D, buttons: Set<Button>) {
    const { x: cX, y: cY } = obstacle.cords;
    const panelWidth = 300;
    const panelHeight = 180;
    const startY = cY - panelHeight;

    ctx.fillStyle = "yellow";
    ctx.fillRect(cX, startY, panelWidth, panelHeight);

    ctx.fillStyle = "red";
    ctx.fillText("SIZE:", cX, startY + 20);
    drawValueControl(
        { x: cX, y: startY + 20 },
        `X: ${obstacle.size.x}`,
        () => obstacle.size.x,
        (val) => (obstacle.size.x = val),
        ctx
    );
    drawValueControl(
        { x: cX, y: startY + 50 },
        `Y: ${obstacle.size.y}`,
        () => obstacle.size.y,
        (val) => (obstacle.size.y = val),
        ctx
    );

    ctx.fillText("CORDS:", cX, startY + 110);
    drawValueControl(
        { x: cX, y: startY + 110 },
        `X: ${obstacle.cords.x}`,
        () => obstacle.cords.x,
        (val) => (obstacle.cords.x = val),
        ctx
    );
    drawValueControl(
        { x: cX, y: startY + 140 },
        `Y: ${obstacle.cords.y}`,
        () => obstacle.cords.y,
        (val) => (obstacle.cords.y = val),
        ctx
    );

    drawHandlers(obstacle, buttons);
}

function drawHandlers(obstacle: Obstacle, buttons: Set<Button>) {
    const padding = 10;
    const size = { x: padding * 2, y: padding * 2 };
    const { x: cx, y: cy } = obstacle.cords;
    const { x: w, y: h } = obstacle.size;
    const color = "#007BFF";

    // top
    buttons.add({
        cords: { x: cx + w / 2 - padding, y: cy - padding * 2 },
        size,
        onClick: () => {
            eS.resizeDirection.value = "top";
            eS.resizeOffset.y = eS.mousePos.y;
            eS.selectedObstacle.value = obstacle;
        },
        color
    });

    // bottom
    buttons.add({
        cords: { x: cx + w / 2 - padding, y: cy + h },
        size,
        onClick: () => {
            eS.resizeDirection.value = "bottom";
            eS.resizeOffset.y = eS.mousePos.y;
            eS.selectedObstacle.value = obstacle;
        },
        color
    });

    // left
    buttons.add({
        cords: { x: cx - padding * 2, y: cy + h / 2 - padding },
        size,
        onClick: () => {
            eS.resizeDirection.value = "left";
            eS.resizeOffset.x = eS.mousePos.x;
            eS.selectedObstacle.value = obstacle;
        },
        color
    });

    // right
    buttons.add({
        cords: { x: cx + w, y: cy + h / 2 - padding },
        size,
        onClick: () => {
            eS.resizeDirection.value = "right";
            eS.resizeOffset.x = eS.mousePos.x;
            eS.selectedObstacle.value = obstacle;
        },
        color
    });

    // center
    buttons.add({
        cords: { x: cx + w / 2 - padding, y: cy + h / 2 - padding },
        size,
        onClick: () => {
            eS.drag.value = true;
            eS.dragOffset.x = eS.mousePos.x - obstacle.cords.x;
            eS.dragOffset.y = eS.mousePos.y - obstacle.cords.y;
            eS.selectedObstacle.value = obstacle;
        },
        color
    });
}

function drawOutlines(obstacle: Obstacle, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "purple";
    const { x: cx, y: cy } = obstacle.cords;
    const { x: w, y: h } = obstacle.size;
    const padding = 10;

    ctx.fillRect(cx, cy, w, padding);
    ctx.fillRect(cx, cy, padding, h);
    ctx.fillRect(cx, cy + h - padding, w, padding);
    ctx.fillRect(cx + w - padding, cy, padding, h);
}

function drawValueControl(
    cords: { x: number; y: number },
    label: string,
    getter: () => number,
    setter: (val: number) => void,
    ctx: CanvasRenderingContext2D
) {
    const buttonWidth = 30;
    const height = 30;
    const spacing = 40;

    const controls = [
        { label: "--", offset: 0, change: -10 },
        { label: "-", offset: spacing, change: -1 },
        { label: label, offset: spacing * 2, change: null },
        { label: "+", offset: spacing * 4, change: 1 },
        { label: "++", offset: spacing * 5, change: 10 },
    ];

    ctx.font = "22px Arial";
    ctx.fillStyle = "red";

    for (const control of controls) {
        const x = cords.x + control.offset;

        if (control.change === null) {
            ctx.fillText(control.label, x, cords.y + height * 0.7);
        } else {

            eS.buttons.add({
                cords: { x, y: cords.y },
                size: { x: buttonWidth, y: height },
                onClick: () => setter(getter() + control.change!),
                color: "black",
            });

            ctx.fillText(control.label, x + 4, cords.y + height * 0.7);
        }
    }
}

function drawButtons(buttons: Set<Button>, ctx: CanvasRenderingContext2D) {
    for (const button of buttons) {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.cords.x, button.cords.y, button.size.x, button.size.y);
    }
}

export { drawHandlers, drawOutlines, drawObstacleParameters, drawButtons };

export { drawPlayers, drawObstacles };
