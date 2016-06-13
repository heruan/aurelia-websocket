"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebsocketClient = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var _aureliaEventAggregator = require("aurelia-event-aggregator");

var _aureliaHttpClient = require("aurelia-http-client");

var _aureliaJson = require("aurelia-json");

var _joinMessage = require("./join-message");

var _leaveMessage = require("./leave-message");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var WebsocketClient_1 = function () {
    function WebsocketClient(httpClient) {
        var _this = this;

        _classCallCheck(this, WebsocketClient);

        this.users = new Set();
        this.connected = false;
        this.eventAggregator = new _aureliaEventAggregator.EventAggregator();
        this.httpClient = httpClient;
        this.on(_joinMessage.JoinMessage.EVENT, function (user) {
            console.log("Connected: " + user.name);
            _this.users.add(user);
        });
        this.on(_leaveMessage.LeaveMessage.EVENT, function (user) {
            console.log("Disconnected: " + user.name);
            _this.users.delete(user);
        });
    }

    WebsocketClient.prototype.getEntityMap = function getEntityMap() {
        return this.entityMap;
    };

    WebsocketClient.prototype.setEntityMap = function setEntityMap(entityMap) {
        this.entityMap = entityMap;
    };

    WebsocketClient.prototype.getRevertMap = function getRevertMap() {
        return this.revertMap;
    };

    WebsocketClient.prototype.setRevertMap = function setRevertMap(revertMap) {
        this.revertMap = revertMap;
    };

    WebsocketClient.prototype.getUsers = function getUsers() {
        return this.users;
    };

    WebsocketClient.prototype.setUsers = function setUsers(users) {
        this.users = users;
    };

    WebsocketClient.prototype.on = function on(event, callback) {
        this.eventAggregator.subscribe(event, callback);
    };

    WebsocketClient.prototype.connect = function connect(url, protocols) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
            var endpoint = new WebSocket(url, protocols);
            endpoint.onopen = function (event) {
                _this2.connected = true;
                _this2.endpoint = endpoint;
                _this2.eventAggregator.subscribe(WebsocketClient_1.USERS_EVENT, function (users) {
                    _this2.users = new Set(users);
                });
                _this2.eventAggregator.publish(WebsocketClient_1.CONNECTED_EVENT, endpoint);
                resolve(_this2);
            };
            endpoint.onclose = function (event) {
                return _this2.connected = false;
            };
            endpoint.onmessage = function (event) {
                return _this2.handleMessage(event.data);
            };
            endpoint.onerror = function (error) {
                return reject(error);
            };
        });
    };

    WebsocketClient.prototype.handleMessage = function handleMessage(message) {
        var jsonDecoder = new _aureliaJson.JsonDecoder(this.entityMap, this.revertMap);
        var jsonMessage = jsonDecoder.decode(message);
        this.eventAggregator.publish(jsonMessage["event"], jsonMessage["payload"]);
    };

    WebsocketClient.prototype.close = function close() {
        this.endpoint.close();
        this.eventAggregator.publish(WebsocketClient_1.DISCONNECTED_EVENT, this);
    };

    WebsocketClient.prototype.send = function send(data) {
        var message = data;
        if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
            message = new _aureliaJson.JsonEncoder(this.entityMap).encode(data);
        }
        switch (this.endpoint.readyState) {
            case WebSocket.CONNECTING:
                this.eventAggregator.subscribeOnce(WebsocketClient_1.CONNECTED_EVENT, function (endpoint) {
                    return endpoint.send(message);
                });
                break;
            case WebSocket.OPEN:
                this.endpoint.send(message);
                break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
            default:
        }
    };

    WebsocketClient.prototype.join = function join(channel) {
        this.send(new _joinMessage.JoinMessage(channel));
    };

    WebsocketClient.prototype.leave = function leave(channel) {
        this.send(new _leaveMessage.LeaveMessage(channel));
    };

    return WebsocketClient;
}();
var WebsocketClient = exports.WebsocketClient = WebsocketClient_1;
WebsocketClient.USERS_EVENT = "endpoint-users";
WebsocketClient.CONNECTED_EVENT = "endpoint-connected";
WebsocketClient.DISCONNECTED_EVENT = "endpoint-disconnected";
exports.WebsocketClient = WebsocketClient = WebsocketClient_1 = __decorate([_aureliaDependencyInjection.autoinject, __metadata('design:paramtypes', [typeof (_a = typeof _aureliaHttpClient.HttpClient !== 'undefined' && _aureliaHttpClient.HttpClient) === 'function' && _a || Object])], WebsocketClient);
var _a;