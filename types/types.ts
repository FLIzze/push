import type { Direction } from "../client/types";

interface WsPlayersList {
    type: "playersList";
    playersData: PlayerData[];
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
    data: Cords[];
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

export type { PlayerInitData, WsInputs, Cords, WsPlayersCordBroadcast, WsCords, WsDisconnect, WsPlayersList, WsConnect };
