var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { autoinject } from "aurelia-dependency-injection";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { JsonEncoder, JsonDecoder } from "aurelia-json";
import { JoinMessage } from "./join-message";
import { LeaveMessage } from "./leave-message";
let WebsocketClient_1 = class WebsocketClient {
    constructor(httpClient) {
        this.users = new Set();
        this.connected = false;
        this.eventAggregator = new EventAggregator();
        this.httpClient = httpClient;
        this.on(JoinMessage.EVENT, user => {
            console.log("Connected: " + user.name);
            this.users.add(user);
        });
        this.on(LeaveMessage.EVENT, user => {
            console.log("Disconnected: " + user.name);
            this.users.delete(user);
        });
    }
    getEntityMap() {
        return this.entityMap;
    }
    setEntityMap(entityMap) {
        this.entityMap = entityMap;
    }
    getRevertMap() {
        return this.revertMap;
    }
    setRevertMap(revertMap) {
        this.revertMap = revertMap;
    }
    getUsers() {
        return this.users;
    }
    setUsers(users) {
        this.users = users;
    }
    on(event, callback) {
        this.eventAggregator.subscribe(event, callback);
    }
    connect(url, protocols) {
        return new Promise((resolve, reject) => {
            let endpoint = new WebSocket(url, protocols);
            endpoint.onopen = event => {
                this.connected = true;
                this.endpoint = endpoint;
                this.eventAggregator.subscribe(WebsocketClient_1.USERS_EVENT, users => {
                    this.users = new Set(users);
                });
                this.eventAggregator.publish(WebsocketClient_1.CONNECTED_EVENT, endpoint);
                resolve(this);
            };
            endpoint.onclose = event => this.connected = false;
            endpoint.onmessage = event => this.handleMessage(event.data);
            endpoint.onerror = error => reject(error);
        });
    }
    handleMessage(message) {
        let jsonDecoder = new JsonDecoder(this.entityMap, this.revertMap);
        let jsonMessage = jsonDecoder.decode(message);
        this.eventAggregator.publish(jsonMessage["event"], jsonMessage["payload"]);
    }
    close() {
        this.endpoint.close();
        this.eventAggregator.publish(WebsocketClient_1.DISCONNECTED_EVENT, this);
    }
    send(data) {
        let message = data;
        if (typeof data === "object") {
            message = new JsonEncoder(this.entityMap).encode(data);
        }
        switch (this.endpoint.readyState) {
            case WebSocket.CONNECTING:
                this.eventAggregator.subscribeOnce(WebsocketClient_1.CONNECTED_EVENT, endpoint => endpoint.send(message));
                break;
            case WebSocket.OPEN:
                this.endpoint.send(message);
                break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
            default:
        }
    }
    join(channel) {
        this.send(new JoinMessage(channel));
    }
    leave(channel) {
        this.send(new LeaveMessage(channel));
    }
};
export let WebsocketClient = WebsocketClient_1;
WebsocketClient.USERS_EVENT = "endpoint-users";
WebsocketClient.CONNECTED_EVENT = "endpoint-connected";
WebsocketClient.DISCONNECTED_EVENT = "endpoint-disconnected";
WebsocketClient = WebsocketClient_1 = __decorate([
    autoinject, 
    __metadata('design:paramtypes', [(typeof (_a = typeof HttpClient !== 'undefined' && HttpClient) === 'function' && _a) || Object])
], WebsocketClient);
var _a;
//# sourceMappingURL=websocket-client.js.map