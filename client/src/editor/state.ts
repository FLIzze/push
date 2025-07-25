import type { Tile, Tool, ToolName } from "../../../types/types";

export const editorConfig = {
    resolution: 16,
    tileSize: 50,
};

export const editorState = {
    globalMousePos: { x: 0, y: 0 },

    canvasMousePos: { x: 0, y: 0 },
    canvasLastMousePos: { x: 0, y: 0 },

    isCreatingTile: true,
    isDragging: false,

    selectedTool: "" as ToolName,
};

export const tileEditor = {
    tileSize: 0,
    zoomLevel: 1,
    nbrTileInGrid: { x: 16, y: 16 },

    pixels: Array.from({ length: 16 },
        () => Array(16).fill(null)),

    selectedColor: "",
};

export const mapEditor = {
    tileSize: 0,
    zoomLevel: 1,
    nbrTileInGrid: { x: 0, y: 0 },

    selectedTileId: "",

    placedTiles: new Map<string, string>(), // cords -> id
    tiles: new Map<string, Tile>(), // id -> Tile
};

export const palette = {
    coords: { x: 50, y: 50 },
    offset: { x: 0, y: 0 },
    buttonSize: 30,

    isDragging: false,
    visible: true,

    type: "" as "tile" | "color",
    content: [] as string[],
};

export const tiles = {
    coords: { x: 50, y: 50 },
    offset: { x: 0, y: 0 },
    buttonSize: 30,

    isDragging: false,
    visible: true,

    tiles: [] as Tile[],
};

export const tools = {
    coords: { x: 300, y: 50 },
    offset: { x: 0, y: 0 },

    isDragging: false,
    visible: true,

    tools:
        [
            {
                name: "add",
                img: "../../img/draw.svg",
                shortcut: "a",
            },
            {
                name: "delete",
                img: "../../img/delete.svg",
                shortcut: "d",
            },
        ] as Tool[],
};
