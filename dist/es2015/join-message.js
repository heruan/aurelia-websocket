import { Message } from "./message";
export class JoinMessage extends Message {
    constructor(channel) {
        super(JoinMessage.EVENT, channel);
    }
}
JoinMessage.EVENT = "user-joined";
//# sourceMappingURL=join-message.js.map