import { Direction } from "../types.ts";

export class Player {
    color: string;
    gravityStrength: number;
    grounded: boolean;

    size: { width: number, height: number };
    cords: { x: number; y: number };
    velocity: { x: number; y: number };
    friction: number;
    terminalVelocity: { x: number, y: number };
    speed: { x: number, y: number };
    inputs: Set<Direction>;

    constructor(size: { width: number, height: number }, color: string) {
        this.size = size;
        this.color = color;

        this.grounded = false;
        this.speed = { x: 0.2, y: -6 };
        this.terminalVelocity = { x: 8, y: -10 };
        this.gravityStrength = 0.5;
        this.friction = 0.8;

        this.cords = { x: 80, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.inputs = new Set<Direction.Left>();
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.cords.x, this.cords.y, this.size.width, this.size.height);
    }

    applyGravity(ctx: CanvasRenderingContext2D) {
        if (!this.grounded) {
            this.velocity.y += this.gravityStrength;

            if (this.velocity.y > Math.abs(this.terminalVelocity.y)) {
                this.velocity.y = Math.abs(this.terminalVelocity.y);
            }
        }

        this.cords.y += this.velocity.y;

        const groundLevel = ctx.canvas.height - this.size.height;
        if (this.cords.y >= groundLevel) {
            this.cords.y = groundLevel;
            this.velocity.y = 0;
            this.grounded = true;
        }
    }

    update() {
        if (this.inputs.has(Direction.Left)) {
            this.velocity.x = Math.max(this.velocity.x - this.speed.x, -this.terminalVelocity.x);
        } else if (this.inputs.has(Direction.Right)) {
            this.velocity.x = Math.min(this.velocity.x + this.speed.x, this.terminalVelocity.x);
        } else {
            this.velocity.x *= this.friction;
            if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
        }

        if (this.inputs.has(Direction.Up) && this.grounded) {
            this.velocity.y = this.speed.y;
            this.grounded = false;
        }

        this.cords.x += this.velocity.x;
        this.cords.y += this.velocity.y;
    }

    startMove(direction: Direction) {
        this.inputs.add(direction);
    }

    stopMove(direction: Direction) {
        this.inputs.delete(direction);
    }
}
