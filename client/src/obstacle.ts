export class Obstacle {
    public readonly color: string;
    public readonly size: { x: number, y: number };
    public cords: { x: number, y: number };

    constructor(cords: { x: number, y: number }, size: { x: number, y: number }) {
        this.size = size;
        this.cords = cords;

        this.color = "blue";
    }
}
