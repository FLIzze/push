import type { PlayerInitData } from "../../types/types.ts";
import { Direction } from "../types.ts";
import type { Obstacle } from "./obstacle.ts";
import { generateUUID } from "./utils/uuid.ts";

export class Player {
    private readonly _gravityStrength: number;
    private readonly _friction: number;
    private readonly _terminalVelocity: { x: number, y: number };

    private _grounded: boolean;
    private _speed: { x: number, y: number };

    public velocity: { x: number; y: number };
    public cords: { x: number; y: number };
    public previousCords: { x: number; y: number };
    public color: string;
    public id: string;
    public size: { x: number, y: number };
    public inputs: Set<Direction>;

    constructor(data?: PlayerInitData) {
        this._gravityStrength = 0.5;
        this._friction = 0.8;
        this._terminalVelocity = { x: 8, y: -20 };

        this._grounded = false;
        this.velocity = { x: 0, y: 0 };
        this._speed = { x: 0.2, y: -12 };

        this.cords = { x: 80, y: 0 };
        this.previousCords = { x: 80, y: 0 };

        this.size = { x: 50, y: 100 };
        this.color = "red";
        this.id = generateUUID();
        this.inputs = new Set<Direction>();

        if (data) {
            Object.assign(this, data);
        }
    }

    private handleInputs() {
        if (this.inputs.has(Direction.Left)) {
            this.velocity.x = Math.max(this.velocity.x - this._speed.x, -this._terminalVelocity.x);
        } else if (this.inputs.has(Direction.Right)) {
            this.velocity.x = Math.min(this.velocity.x + this._speed.x, this._terminalVelocity.x);
        } else {
            this.velocity.x *= this._friction;
            if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
        }

        if (this.inputs.has(Direction.Up) && this._grounded) {
            this.velocity.y = this._speed.y;
            this._grounded = false;
        }
    }

    private applyGravity() {
        if (!this._grounded) {
            this.velocity.y += this._gravityStrength;
            if (this.velocity.y > Math.abs(this._terminalVelocity.y)) {
                this.velocity.y = Math.abs(this._terminalVelocity.y);
            }
        }
    }

    public hasMoved(): boolean {
        return this.cords.x !== this.previousCords.x || this.cords.y !== this.previousCords.y;
    }

    public update(obstacles: Set<Obstacle>) {
        this.previousCords = { ...this.cords };
        this.handleInputs();
        this.applyGravity();

        this.cords.x += this.velocity.x;
        this.resolveCollisions(obstacles, "x");

        this.cords.y += this.velocity.y;
        this._grounded = false;
        this.resolveCollisions(obstacles, "y");
    }


    private resolveCollisions(obstacles: Set<Obstacle>, axis: "x" | "y") {
        for (const obs of obstacles) {
            const playerRight = this.cords.x + this.size.x;
            const playerBottom = this.cords.y + this.size.y;
            const obsRight = obs.cords.x + obs.size.x;
            const obsBottom = obs.cords.y + obs.size.y;

            const isColliding =
                playerRight > obs.cords.x &&
                this.cords.x < obsRight &&
                playerBottom > obs.cords.y &&
                this.cords.y < obsBottom;

            if (!isColliding) continue;

            if (axis === "x") {
                if (this.velocity.x > 0) {
                    this.cords.x = obs.cords.x - this.size.x;
                } else if (this.velocity.x < 0) {
                    this.cords.x = obs.cords.x + obs.size.x;
                }

                this.velocity.x = 0;
            } else if (axis === "y") {
                if (this.velocity.y > 0) {
                    this.cords.y = obs.cords.y - this.size.y;
                    this._grounded = true;
                } else if (this.velocity.y < 0) {
                    this.cords.y = obs.cords.y + obs.size.y;
                }

                this.velocity.y = 0;
            }
        }
    }
}
