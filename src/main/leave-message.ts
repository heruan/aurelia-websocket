import { Message} from "./message";

export class LeaveMessage extends Message {

    public static EVENT: string = "user-left";

    constructor(channel: string) {
        super(LeaveMessage.EVENT, channel);
    }

}
