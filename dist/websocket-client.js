"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_http_client_1 = require("aurelia-http-client");
var aurelia_json_1 = require("aurelia-json");
var join_message_1 = require("./join-message");
var leave_message_1 = require("./leave-message");
var WebsocketClient = (function () {
    function WebsocketClient(httpClient, reconnectAfter) {
        var _this = this;
        if (reconnectAfter === void 0) { reconnectAfter = 0; }
        this.users = new Set();
        this.connected = false;
        this.reconnectAfter = 0; ///< Time in seconds to wait until next reconnect.
        this.reconnecting = false; ///< True during reconnection algorithm.
        this.url = '';
        this.protocols = '';
        this.eventAggregator = new aurelia_event_aggregator_1.EventAggregator();
        this.httpClient = httpClient;
        this.reconnectAfter = reconnectAfter;
        this.on(join_message_1.JoinMessage.EVENT, function (user) {
            console.log("Connected: " + user.name);
            _this.users.add(user);
        });
        this.on(leave_message_1.LeaveMessage.EVENT, function (user) {
            console.log("Disconnected: " + user.name);
            _this.users.delete(user);
        });
    }
    WebsocketClient.prototype.getEntityMap = function () {
        return this.entityMap;
    };
    WebsocketClient.prototype.setEntityMap = function (entityMap) {
        this.entityMap = entityMap;
    };
    WebsocketClient.prototype.getRevertMap = function () {
        return this.revertMap;
    };
    WebsocketClient.prototype.setRevertMap = function (revertMap) {
        this.revertMap = revertMap;
    };
    WebsocketClient.prototype.getUsers = function () {
        return this.users;
    };
    WebsocketClient.prototype.setUsers = function (users) {
        this.users = users;
    };
    WebsocketClient.prototype.on = function (event, callback) {
        this.eventAggregator.subscribe(event, callback);
    };
    WebsocketClient.prototype.connect = function (url, protocols) {
        var _this = this;
        this.url = url;
        this.protocols = protocols;
        return new Promise(function (resolve, reject) {
            var endpoint = new WebSocket(url, protocols);
            endpoint.onopen = function (event) {
                _this.reconnecting = false; // Reconnecting algorithm stopped.
                _this.connected = true;
                _this.endpoint = endpoint;
                _this.eventAggregator.subscribe(WebsocketClient.USERS_EVENT, function (users) {
                    _this.users = new Set(users);
                });
                _this.eventAggregator.publish(WebsocketClient.CONNECTED_EVENT, endpoint);
                resolve(_this);
            };
            endpoint.onclose = function (event) { return _this.onEndPointClose(event); };
            endpoint.onmessage = function (event) { return _this.handleMessage(event.data); };
            endpoint.onerror = function (error) { reject(error); _this.onEndPointError(error); };
        });
    };
    WebsocketClient.prototype.reconnect = function () {
        // Only start reconnection algorithm only if not already started
        if (!this.reconnecting) {
            this._reconnect();
            return true;
        }
        return false;
    };
    WebsocketClient.prototype.isConnected = function () {
        return this.connected;
    };
    WebsocketClient.prototype.setReconnectTimeout = function (reconnectAfter) {
        this.reconnectAfter = reconnectAfter;
    };
    WebsocketClient.prototype.onEndPointClose = function (event) {
        var _this = this;
        this.connected = false;
        console.log('EP closed the socket!');
        // Tell subscribers the web socket got closed
        this.eventAggregator.publish(WebsocketClient.DISCONNECTED_EVENT, this);
        if (this.reconnectAfter > 0) {
            this.reconnecting = true; // Starting reconnection alorithm.
            // Wait 'reconnectAfter' seconds and then reconnect
            setTimeout(function () { return _this.onReconnect(); }, this.reconnectAfter * 1000);
        }
    };
    WebsocketClient.prototype.onEndPointError = function (error) {
        console.log('EP socket error!');
    };
    WebsocketClient.prototype.onReconnect = function () {
        this._reconnect();
    };
    WebsocketClient.prototype._reconnect = function () {
        // Tell subscribers WS starts reconnection algorithm
        this.eventAggregator.publish(WebsocketClient.RECONNECTING_EVENT, this);
        // Connect again
        this.connect(this.url, this.protocols);
    };
    WebsocketClient.prototype.handleMessage = function (message) {
        var jsonDecoder = new aurelia_json_1.JsonDecoder(this.entityMap, this.revertMap);
        var jsonMessage = jsonDecoder.decode(message);
        this.eventAggregator.publish(jsonMessage["event"], jsonMessage["payload"]);
    };
    WebsocketClient.prototype.close = function () {
        this.endpoint.close();
        this.eventAggregator.publish(WebsocketClient.DISCONNECTED_EVENT, this);
    };
    WebsocketClient.prototype.send = function (data) {
        var message = data;
        if (typeof data === "object") {
            message = new aurelia_json_1.JsonEncoder(this.entityMap).encode(data);
        }
        switch (this.endpoint.readyState) {
            case WebSocket.CONNECTING:
                this.eventAggregator.subscribeOnce(WebsocketClient.CONNECTED_EVENT, function (endpoint) { return endpoint.send(message); });
                break;
            case WebSocket.OPEN:
                this.endpoint.send(message);
                break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
            default:
        }
    };
    WebsocketClient.prototype.join = function (channel) {
        this.send(new join_message_1.JoinMessage(channel));
    };
    WebsocketClient.prototype.leave = function (channel) {
        this.send(new leave_message_1.LeaveMessage(channel));
    };
    WebsocketClient.USERS_EVENT = "endpoint-users";
    WebsocketClient.CONNECTED_EVENT = "endpoint-connected";
    WebsocketClient.DISCONNECTED_EVENT = "endpoint-disconnected";
    WebsocketClient.RECONNECTING_EVENT = "endpoint-reconnecting";
    WebsocketClient = __decorate([
        aurelia_dependency_injection_1.autoinject, 
        __metadata('design:paramtypes', [aurelia_http_client_1.HttpClient, Number])
    ], WebsocketClient);
    return WebsocketClient;
}());
exports.WebsocketClient = WebsocketClient;
//# sourceMappingURL=websocket-client.js.map