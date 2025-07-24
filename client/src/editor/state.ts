import type { Tile, Tool, ToolName } from "../../../types/types";

export const editorState = {
    mousePos: { x: 0, y: 0 },
    lastMousePos: { x: 0, y: 0 },

    isCreatingTile: true,
    isDragging: false,

    selectedTool: "add" as ToolName,
};

export const tileEditor = {
    tileSize: 0,
    zoomLevel: 1,
    nbrTileInGrid: { x: 16, y: 16 },

    pixels: Array.from({ length: 16 },
        () => Array(16).fill(null)),

    selectedColor: "black",
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

    colors: [
        // RED Gradient
        ["#330000", "#660000", "#990000", "#CC0000", "#FF0000", "#FF6666", "#FF9999", "#FFE5E5"],
        // ORANGE Gradient
        ["#331A00", "#663300", "#994D00", "#CC6600", "#FF8000", "#FFA64D", "#FFCC99", "#FFF2E5"],
        // YELLOW Gradient
        ["#333300", "#666600", "#999900", "#CCCC00", "#FFFF00", "#FFFF66", "#FFFF99", "#FFFFE5"],
        // GREEN Gradient
        ["#003300", "#006600", "#009900", "#00CC00", "#00FF00", "#66FF66", "#99FF99", "#E5FFE5"],
        // TEAL Gradient
        ["#003333", "#006666", "#009999", "#00CCCC", "#00FFFF", "#66FFFF", "#99FFFF", "#E5FFFF"],
        // BLUE Gradient
        ["#000033", "#000066", "#000099", "#0000CC", "#0000FF", "#6666FF", "#9999FF", "#E5E5FF"],
        // PURPLE Gradient
        ["#1A0033", "#330066", "#4D0099", "#6600CC", "#8000FF", "#A64DFF", "#CC99FF", "#F2E5FF"],
        // PINK Gradient
        ["#33001A", "#660033", "#99004D", "#CC0066", "#FF007F", "#FF66A3", "#FFB3CC", "#FFE5F2"],
        // GRAY Scale
        ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F2F2F2", "#FFFFFF"]
    ]
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
                shortcut: "a",
            },
            {
                name: "delete",
                shortcut: "d",
            },
        ] as Tool[],
};
