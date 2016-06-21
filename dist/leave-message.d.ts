import { Message } from "./message";
export declare class LeaveMessage extends Message {
    static EVENT: string;
    constructor(channel: string);
}
