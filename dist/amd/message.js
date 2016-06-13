define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Message = exports.Message = function Message(event, payload) {
        _classCallCheck(this, Message);

        this.event = event;
        this.payload = payload;
    };
});