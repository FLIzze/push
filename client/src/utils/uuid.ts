import { v4 as uuidv4 } from "uuid";

// TODO just make it without v4

export function generateUUID(): string {
    return uuidv4();
}
