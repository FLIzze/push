interface WsPlayersList {
    type: "playersList";
    data: PlayerData[];
}

interface PlayerData {
    id: string;
    name: string;
    size: { x: number, y: number };
    cords: { x: number, y: number };
    color: string;
}

interface WsConnect {
    type: "connect";
    data: PlayerData;
}

interface WsDisconnect {
    type: "disconnect";
    data: {
        id: string;
    };
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

export { Cords, WsPlayersCordBroadcast, WsCords, WsDisconnect, WsPlayersList, WsConnect, PlayerData };
