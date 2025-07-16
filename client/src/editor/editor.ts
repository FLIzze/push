import { Obstacle } from "../obstacle";
import { drawObstacles } from "../utils/draw";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

interface Button {
    cords: { x: number; y: number };
    size: { x: number; y: number };
    onClick: () => void;
}

let mousePos = { x: 0, y: 0 };
let selectedObstacle: Obstacle | null = null;
const obstacles = new Set<Obstacle>();
let buttons: Button[] = [];

document.addEventListener("mousemove", (e) => {
    mousePos = { x: e.x, y: e.y };
});

document.addEventListener("mousedown", (e) => {
    switch (e.button) {
        case 0:
            if (handleButtonClick()) return;
            if (selectObstacleUnderMouse()) return;

            if (selectedObstacle) {
                selectedObstacle = null;
                return;
            }

            const newObstacle = new Obstacle({ x: e.x, y: e.y }, { x: 100, y: 100 }, "red");
            obstacles.add(newObstacle);
            break;
        case 1:
            if (selectObstacleUnderMouse()) {
                obstacles.delete(selectedObstacle!);
                selectedObstacle = null;
            }
            break;
        default:
            break;
    }
});

function handleButtonClick(): boolean {
    for (const button of buttons) {
        if (isPointInside(mousePos, button.cords, button.size)) {
            button.onClick();
            return true;
        }
    }
    return false;
}

function selectObstacleUnderMouse(): boolean {
    for (const obstacle of obstacles) {
        if (isPointInside(mousePos, obstacle.cords, obstacle.size)) {
            selectedObstacle = obstacle;
            return true;
        }
    }
    return false;
}

function isPointInside(
    point: { x: number; y: number }, topLeft: { x: number; y: number },
    size: { x: number; y: number })
    : boolean {
    return (
        point.x > topLeft.x &&
        point.x < topLeft.x + size.x &&
        point.y > topLeft.y &&
        point.y < topLeft.y + size.y
    );
}

function drawValueControl(
    cords: { x: number; y: number },
    label: string,
    getter: () => number,
    setter: (val: number) => void
) {
    ctx.font = "22px Arial";
    ctx.fillStyle = "black";

    const buttonWidth = 20;
    const height = 40;
    const spacing = 40;

    const controls = [
        { label: "--", offset: 0, change: -10 },
        { label: "-", offset: spacing, change: -1 },
        { label: label, offset: spacing * 2, change: null },
        { label: "+", offset: spacing * 4, change: 1 },
        { label: "++", offset: spacing * 5, change: 10 },
    ];

    for (const control of controls) {
        const x = cords.x + control.offset;
        ctx.fillText(control.label, x, cords.y);

        if (control.change !== null) {
            buttons.push({
                cords: { x, y: cords.y - height + 10 },
                size: { x: buttonWidth, y: height },
                onClick: () => setter(getter() + control.change!)
            });
        }
    }
}

function drawObstacleParameters(obstacle: Obstacle) {
    buttons = [];

    const { x: cX, y: cY } = obstacle.cords;
    const panelWidth = 300;
    const panelHeight = 180;
    const startY = cY - panelHeight;

    ctx.fillStyle = "yellow";
    ctx.fillRect(cX, startY, panelWidth, panelHeight);
    ctx.fillStyle = "black";
    ctx.font = "22px Arial";

    ctx.fillText("SIZE:", cX, startY + 20);
    drawValueControl(
        { x: cX, y: startY + 50 },
        `X: ${obstacle.size.x}`,
        () => obstacle.size.x,
        (val) => (obstacle.size.x = val)
    );
    drawValueControl(
        { x: cX, y: startY + 80 },
        `Y: ${obstacle.size.y}`,
        () => obstacle.size.y,
        (val) => (obstacle.size.y = val)
    );

    ctx.fillText("CORDS:", cX, startY + 110);
    drawValueControl(
        { x: cX, y: startY + 140 },
        `X: ${obstacle.cords.x}`,
        () => obstacle.cords.x,
        (val) => (obstacle.cords.x = val)
    );
    drawValueControl(
        { x: cX, y: startY + 170 },
        `Y: ${obstacle.cords.y}`,
        () => obstacle.cords.y,
        (val) => (obstacle.cords.y = val)
    );
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObstacles(ctx, obstacles);

    if (selectedObstacle) {
        drawObstacleParameters(selectedObstacle);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
