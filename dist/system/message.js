"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var Message;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export("Message", Message = function Message(event, payload) {
                _classCallCheck(this, Message);

                this.event = event;
                this.payload = payload;
            });

            _export("Message", Message);
        }
    };
});