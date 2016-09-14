import { Message } from "./message";
export declare class JoinMessage extends Message {
    static EVENT: string;
    constructor(channel: string);
}
