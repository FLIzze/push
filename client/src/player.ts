import type { ObstacleData, PlayerInitData } from "../../types/types.ts";
import { Direction } from "../types.ts";
import { generateUUID } from "./utils/uuid.ts";

export class Player {
    private readonly _gravityStrength: number;
    private readonly _friction: number;
    private readonly _terminalVelocity: { x: number, y: number };

    private _grounded: boolean;
    private _velocity: { x: number; y: number };
    private _speed: { x: number, y: number };

    public cords: { x: number; y: number };
    public color: string;
    public id: string;
    public size: { x: number, y: number };
    public inputs: Set<Direction>;

    constructor(data?: PlayerInitData) {
        this._gravityStrength = 0.5;
        this._friction = 0.8;
        this._terminalVelocity = { x: 8, y: -10 };

        this._grounded = false;
        this._velocity = { x: 0, y: 0 };
        this._speed = { x: 0.2, y: -8 };

        this.cords = { x: 80, y: 0 };
        this.size = { x: 50, y: 100 };
        this.color = "red";
        this.id = generateUUID();
        this.inputs = new Set<Direction>();

        if (data) {
            Object.assign(this, data);
        }
    }

    public applyGravity() {
        if (!this._grounded) {
            this._velocity.y += this._gravityStrength;

            if (this._velocity.y > Math.abs(this._terminalVelocity.y)) {
                this._velocity.y = Math.abs(this._terminalVelocity.y);
            }
        }

        this.cords.y += this._velocity.y;

        const groundLevel = 300;
        if (this.cords.y >= groundLevel) {
            this.cords.y = groundLevel;
            this._velocity.y = 0;
            this._grounded = true;
        }
    }

    public update() {
        if (this.inputs.has(Direction.Left)) {
            this._velocity.x = Math.max(this._velocity.x - this._speed.x, -this._terminalVelocity.x);
        } else if (this.inputs.has(Direction.Right)) {
            this._velocity.x = Math.min(this._velocity.x + this._speed.x, this._terminalVelocity.x);
        } else {
            this._velocity.x *= this._friction;
            if (Math.abs(this._velocity.x) < 0.1) this._velocity.x = 0;
        }

        if (this.inputs.has(Direction.Up) && this._grounded) {
            this._velocity.y = this._speed.y;
            this._grounded = false;
        }

        this.cords.x += this._velocity.x;
        this.cords.y += this._velocity.y;
    }

    public collisions(obstacles: Set<ObstacleData>) {
    }

    public startMove(direction: Direction) {
        this.inputs.add(direction);
    }

    public stopMove(direction: Direction) {
        this.inputs.delete(direction);
    }
}
