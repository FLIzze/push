export enum Direction {
    Left,
    Right,
    Up,
}

export interface Obstacle {
    cords: { x: number, y: number };
    color: string;
}
