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

interface WsPing {
    type: "ping";
    timestamp: number;
}

interface Button {
    cords: { x: number, y: number };
    size: { x: number, y: number };
    onClick: () => void;
    color: string;
    label?: string;
}

interface Tool {
    cords: { x: number, y: number };
    size: { x: number, y: number };
    label: "edit" | "add" | "delete";
}

export type { Tool, Button, WsPing, ObstacleData, WsGameData, PlayerInitData, WsInputs, Cords, WsPlayersCordBroadcast, WsCords, WsDisconnect, WsConnect };
