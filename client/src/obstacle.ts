export class Obstacle {
    public readonly cords: { x: number, y: number };
    public readonly size: { x: number, y: number };
    public readonly color: string;

    constructor(cords: { x: number, y: number }, size: { x: number, y: number }, color: string) {
        this.size = size;
        this.cords = cords;
        this.color = color;
    }
}
