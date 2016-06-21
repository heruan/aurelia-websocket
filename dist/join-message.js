"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var message_1 = require("./message");
var JoinMessage = (function (_super) {
    __extends(JoinMessage, _super);
    function JoinMessage(channel) {
        _super.call(this, JoinMessage.EVENT, channel);
    }
    JoinMessage.EVENT = "user-joined";
    return JoinMessage;
}(message_1.Message));
exports.JoinMessage = JoinMessage;
//# sourceMappingURL=join-message.js.map