export class Obstacle {
    public cords: { x: number, y: number };
    public size: { x: number, y: number };
    public color: string;

    constructor(cords: { x: number, y: number }, size: { x: number, y: number }, color: string) {
        this.size = size;
        this.cords = cords;
        this.color = color;
    }
}
