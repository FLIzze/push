import type { Button, Obstacle, Pixel, Tile } from "../../../types/types";
import { generateUUID } from "../utils/uuid";
import { editorState, editorState as eS, mapEditor, tileEditor } from "./state";

export function addPixel(newPixel: Pixel) {
    for (const pixel of eS.pixels) {
        if (newPixel.cords.x === pixel.cords.x && newPixel.cords.y === pixel.cords.y) {
            if (newPixel.color !== pixel.color) {
                pixel.color = newPixel.color;
            }

            return;
        }
    }

    eS.pixels.add(newPixel);
}

export function returnButtonUnderMouse(): Button | null {
    const mX = eS.mousePos.x * eS.tileSize;
    const mY = eS.mousePos.y * eS.tileSize;

    for (const button of eS.buttons) {
        if (
            button.cords.x < mX &&
            button.cords.x + button.size.x > mX &&
            button.cords.y < mY &&
            button.cords.y + button.size.y > mY
        ) {
            return button;
        }
    }

    return null;
}

export function returnPixelUnderMouse(): Pixel | null {
    for (const pixel of eS.pixels) {
        if (pixel.cords.x === eS.mousePos.x && pixel.cords.y === eS.mousePos.y) {
            return pixel;
        }
    }

    return null;
}

export function returnColorUnderMouse(): Pixel | null {
    for (const color of eS.colors) {
        if (color.cords.x === eS.mousePos.x && color.cords.y === eS.mousePos.y) {
            return color;
        }
    }

    return null;
}

export function returnObstacleUnderMouse(): Obstacle | null {
    for (const obstacle of eS.obstacles) {
        if (obstacle.cords.x === eS.mousePos.x && obstacle.cords.y === eS.mousePos.y) {
            return obstacle;
        }
    }

    return null;
}

export function deleteObstacle(obstacle: Obstacle) {
    eS.obstacles.delete(obstacle);
}

export function deletePixel(pixel: Pixel) {
    eS.pixels.delete(pixel);
}

export function saveTile() {
    const tileId = generateUUID();

    const tile: Tile = {
        id: tileId,
        pixels: tileEditor.pixels,
    };

    const json = JSON.stringify(tile, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = tileId;
    link.click();

    URL.revokeObjectURL(url);
}
