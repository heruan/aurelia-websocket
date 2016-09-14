"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var message_1 = require("./message");
var LeaveMessage = (function (_super) {
    __extends(LeaveMessage, _super);
    function LeaveMessage(channel) {
        _super.call(this, LeaveMessage.EVENT, channel);
    }
    LeaveMessage.EVENT = "user-left";
    return LeaveMessage;
}(message_1.Message));
exports.LeaveMessage = LeaveMessage;
//# sourceMappingURL=leave-message.js.map