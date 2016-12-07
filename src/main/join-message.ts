import { Message } from "./message";

export class JoinMessage extends Message {

    public static EVENT: string = "user-joined";

    constructor(channel: string) {
        super(JoinMessage.EVENT, channel);
    }

}
