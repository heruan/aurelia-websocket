import { Message } from "./message";
export class LeaveMessage extends Message {
    constructor(channel) {
        super(LeaveMessage.EVENT, channel);
    }
}
LeaveMessage.EVENT = "user-left";
//# sourceMappingURL=leave-message.js.map