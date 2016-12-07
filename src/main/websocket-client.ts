import { autoinject } from "aurelia-dependency-injection";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { JsonEncoder, JsonDecoder } from "aurelia-json";
import { Message } from "./message";
import { JoinMessage } from "./join-message";
import { LeaveMessage } from "./leave-message";

@autoinject
export class WebsocketClient {

    public static USERS_EVENT: string = "endpoint-users";

    public static CONNECTED_EVENT: string = "endpoint-connected";

    public static DISCONNECTED_EVENT: string = "endpoint-disconnected";

    public users: Set<Object> = new Set<Object>();

    private eventAggregator: EventAggregator;

    private httpClient: HttpClient;

    private jsonDecoder: JsonDecoder;

    private endpoint: WebSocket;

    private connected: boolean = false;

    private entityMap: Map<string, Object>;

    private revertMap: Map<Object, Object>;

    public constructor(httpClient: HttpClient, jsonDecoder: JsonDecoder) {
        this.eventAggregator = new EventAggregator();
        this.httpClient = httpClient;
        this.jsonDecoder = jsonDecoder;
        this.on(JoinMessage.EVENT, user => {
            console.log("Connected: " + user.name);
            this.users.add(user);
        });
        this.on(LeaveMessage.EVENT, user => {
            console.log("Disconnected: " + user.name);
            this.users.delete(user);
        });
    }

    public getUsers(): Set<Object> {
        return this.users;
    }

    public setUsers(users: Set<Object>) {
        this.users = users;
    }

    public on(event: string, callback: Function) {
        this.eventAggregator.subscribe(event, callback);
    }

    public connect(url: string, protocols?: string|string[]): Promise<WebsocketClient> {
        return new Promise<WebsocketClient>((resolve, reject) => {
            let endpoint = new WebSocket(url, protocols);
            endpoint.onopen = event => {
                this.connected = true;
                this.endpoint = endpoint;
                this.eventAggregator.subscribe(WebsocketClient.USERS_EVENT, users => {
                    this.users = new Set<Object>(users);
                });
                this.eventAggregator.publish(WebsocketClient.CONNECTED_EVENT, endpoint);
                resolve(this);
            };
            endpoint.onclose = event => this.connected = false;
            endpoint.onmessage = event => this.handleMessage(event.data);
            endpoint.onerror = error => reject(error);
        });
    }

    private handleMessage(message: any) {
        let jsonMessage = this.jsonDecoder.decode(message, Message);
        this.eventAggregator.publish(jsonMessage.event, jsonMessage.payload);
    }

    public close(): void {
        this.endpoint.close();
        this.eventAggregator.publish(WebsocketClient.DISCONNECTED_EVENT, this);
    }

    public send(data: any): void {
        let message = data;
        if (typeof data === "object") {
            message = new JsonEncoder().encode(data);
        }
        switch (this.endpoint.readyState) {
            case WebSocket.CONNECTING:
            this.eventAggregator.subscribeOnce(WebsocketClient.CONNECTED_EVENT, endpoint => endpoint.send(message));
            break;
            case WebSocket.OPEN:
            this.endpoint.send(message);
            break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
            default:
            // do nothing
        }
    }

    public join(channel: string): void {
        this.send(new JoinMessage(channel));
    }

    public leave(channel: string): void {
        this.send(new LeaveMessage(channel));
    }

}
