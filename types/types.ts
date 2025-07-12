import type { Obstacle } from "../client/src/obstacle";
import type { Direction } from "../client/types";

interface WsGameData {
    type: "gameData";
    playersData: PlayerData[];
    obstaclesData: ObstacleData[];
}

interface ObstacleData {
    color: string;
    cords: { x: number, y: number };
    size: { x: number, y: number };
}

interface PlayerData {
    id: string;
    color: string;
    cords: { x: number, y: number };
    size: { x: number, y: number };
}

interface WsConnect {
    type: "connect";
    playerData: PlayerData;
}

interface WsDisconnect {
    type: "disconnect";
    id: string;
}

interface WsCords {
    type: "cords";
    data: Cords;
}

interface WsPlayersCordBroadcast {
    type: "broadcast";
    cords: Cords[];
}

interface Cords {
    cords: { x: number, y: number };
    id: string;
}

interface WsInputs {
    type: "inputs";
    inputs: Direction[];
}

interface PlayerInitData {
    id?: string;
    color?: string;
    cords?: { x: number; y: number };
    size?: { x: number; y: number };
}

export type { ObstacleData, WsGameData, PlayerInitData, WsInputs, Cords, WsPlayersCordBroadcast, WsCords, WsDisconnect, WsConnect };
