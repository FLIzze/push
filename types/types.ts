export interface WsGameData {
    type: "gameData";
    playersData: PlayerData[];
    obstaclesData: ObstacleData[];
};

interface ObstacleData {
    color: string;
    cords: { x: number, y: number };
    size: { x: number, y: number };
};

interface PlayerData {
    id: string;
    color: string;
    cords: { x: number, y: number };
    size: { x: number, y: number };
};

export interface WsConnect {
    type: "connect";
    playerData: PlayerData;
};

export interface WsDisconnect {
    type: "disconnect";
    id: string;
};

export interface WsCords {
    type: "cords";
    data: Cords;
};

export interface WsPlayersCordBroadcast {
    type: "broadcast";
    cords: Cords[];
};

export interface Cords {
    cords: { x: number, y: number };
    id: string;
};

export interface WsInputs {
    type: "inputs";
    inputs: Direction[];
};

export interface PlayerInitData {
    id?: string;
    color?: string;
    cords?: { x: number; y: number };
    size?: { x: number; y: number };
};

export interface WsPing {
    type: "ping";
    timestamp: number;
};

export interface Tile {
    id: string,
    pixels: string[][];
};

export interface Color {
    cords: { x: number, y: number };
    color: string;
};

export interface Tool {
    name: ToolName,
    shortcut: string,
};

export type ToolName = "add" | "delete";

export enum Direction {
    Left,
    Right,
    Up,
};

export interface Pixel {
    cords: { x: number, y: number };
    color: string;
};
