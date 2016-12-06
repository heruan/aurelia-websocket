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
var message_1 = require("./message");
var join_message_1 = require("./join-message");
var leave_message_1 = require("./leave-message");
var WebsocketClient = (function () {
    function WebsocketClient(httpClient, jsonDecoder) {
        var _this = this;
        this.users = new Set();
        this.connected = false;
        this.eventAggregator = new aurelia_event_aggregator_1.EventAggregator();
        this.httpClient = httpClient;
        this.jsonDecoder = jsonDecoder;
        this.on(join_message_1.JoinMessage.EVENT, function (user) {
            console.log("Connected: " + user.name);
            _this.users.add(user);
        });
        this.on(leave_message_1.LeaveMessage.EVENT, function (user) {
            console.log("Disconnected: " + user.name);
            _this.users.delete(user);
        });
    }
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
        return new Promise(function (resolve, reject) {
            var endpoint = new WebSocket(url, protocols);
            endpoint.onopen = function (event) {
                _this.connected = true;
                _this.endpoint = endpoint;
                _this.eventAggregator.subscribe(WebsocketClient.USERS_EVENT, function (users) {
                    _this.users = new Set(users);
                });
                _this.eventAggregator.publish(WebsocketClient.CONNECTED_EVENT, endpoint);
                resolve(_this);
            };
            endpoint.onclose = function (event) { return _this.connected = false; };
            endpoint.onmessage = function (event) { return _this.handleMessage(event.data); };
            endpoint.onerror = function (error) { return reject(error); };
        });
    };
    WebsocketClient.prototype.handleMessage = function (message) {
        var jsonMessage = this.jsonDecoder.decode(message, message_1.Message);
        this.eventAggregator.publish(jsonMessage.event, jsonMessage.payload);
    };
    WebsocketClient.prototype.close = function () {
        this.endpoint.close();
        this.eventAggregator.publish(WebsocketClient.DISCONNECTED_EVENT, this);
    };
    WebsocketClient.prototype.send = function (data) {
        var message = data;
        if (typeof data === "object") {
            message = new aurelia_json_1.JsonEncoder().encode(data);
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
    return WebsocketClient;
}());
WebsocketClient.USERS_EVENT = "endpoint-users";
WebsocketClient.CONNECTED_EVENT = "endpoint-connected";
WebsocketClient.DISCONNECTED_EVENT = "endpoint-disconnected";
WebsocketClient = __decorate([
    aurelia_dependency_injection_1.autoinject,
    __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_json_1.JsonDecoder])
], WebsocketClient);
exports.WebsocketClient = WebsocketClient;
