import {autoinject} from "aurelia-dependency-injection";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {HttpClient} from "aurelia-http-client";
import {JsonEncoder, JsonDecoder} from "aurelia-json";
import {JoinMessage} from "./join-message";
import {LeaveMessage} from "./leave-message";

@autoinject
export class WebsocketClient {

    public static USERS_EVENT: string = "endpoint-users";

    public static CONNECTED_EVENT: string = "endpoint-connected";

    public static DISCONNECTED_EVENT: string = "endpoint-disconnected";

    public static RECONNECTING_EVENT: string = "endpoint-reconnecting";

    public users: Set<Object> = new Set<Object>();

    private eventAggregator: EventAggregator;

    private httpClient: HttpClient;

    private endpoint: WebSocket;

    private connected: boolean = false;

    private entityMap: Map<string, Object>;

    private revertMap: Map<Object, Object>;

    private reconnectAfter: number = 0;                     ///< Time in seconds to wait until next reconnect.

    private reconnecting: boolean = false;                  ///< True during reconnection algorithm.

    private url: string = '';

    private protocols: string | string [] = '';

    public constructor(httpClient: HttpClient, reconnectAfter: number = 0) {
        this.eventAggregator = new EventAggregator();
        this.httpClient = httpClient;
        this.reconnectAfter = reconnectAfter;
        this.on(JoinMessage.EVENT, user => {
            console.log("Connected: " + user.name);
            this.users.add(user);
        });
        this.on(LeaveMessage.EVENT, user => {
            console.log("Disconnected: " + user.name);
            this.users.delete(user);
        });
    }

    public getEntityMap(): Map<string, Object> {
        return this.entityMap;
    }

    public setEntityMap(entityMap: Map<string, Object>) {
        this.entityMap = entityMap;
    }

    public getRevertMap(): Map<Object, Object> {
        return this.revertMap;
    }

    public setRevertMap(revertMap: Map<Object, Object>) {
        this.revertMap = revertMap;
    }

    public getUsers(): Set<Object> {
        return this.users;
    }

    public setUsers(users: Set<Object>) {
        this.users = users;
    }

    public on(event: string, callback: Function) : Subscription {
        return this.eventAggregator.subscribe(event, callback);
    }

    public connect(url: string, protocols?: string|string[]): Promise<WebsocketClient> {
        this.url = url;
        this.protocols = protocols;
        return new Promise<WebsocketClient>((resolve, reject) => {
            let endpoint = new WebSocket(url, protocols);
            endpoint.onopen = event => {
                this.reconnecting = false;  // Reconnecting algorithm stopped.
                this.connected = true;
                this.endpoint = endpoint;
                this.eventAggregator.subscribe(WebsocketClient.USERS_EVENT, users => {
                    this.users = new Set<Object>(users);
                });
                this.eventAggregator.publish(WebsocketClient.CONNECTED_EVENT, endpoint);
                resolve(this);
            };
            endpoint.onclose = event => this.onEndPointClose(event);
            endpoint.onmessage = event => this.handleMessage(event.data);
            endpoint.onerror = error => { reject(error); this.onEndPointError(error); }
        });
    }

    public reconnect() : boolean {
        // Only start reconnection algorithm only if not already started
        if (!this.reconnecting) {
            this._reconnect();
            return true;
        }
        return false;
    }

    public isConnected() : boolean {
        return this.connected;
    }

    public setReconnectTimeout(reconnectAfter: number){
        this.reconnectAfter = reconnectAfter;
    }

    private onEndPointClose(event: CloseEvent) {
        this.connected = false;
        console.log('EP closed the socket!');
        // Tell subscribers the web socket got closed
        this.eventAggregator.publish(WebsocketClient.DISCONNECTED_EVENT, this);

        if (this.reconnectAfter > 0)
        {
            this.reconnecting = true;    // Starting reconnection alorithm.
            // Wait 'reconnectAfter' seconds and then reconnect
            setTimeout(() => this.onReconnect(), this.reconnectAfter * 1000);
        }
    }

    private onEndPointError(error: ErrorEvent){

        console.log('EP socket error!');
    }

    private onReconnect() {
        this._reconnect();
    }

    private _reconnect() {
        // Tell subscribers WS starts reconnection algorithm
        this.eventAggregator.publish(WebsocketClient.RECONNECTING_EVENT, this);
        // Connect again
        this.connect(this.url, this.protocols);
    }

    private handleMessage(message: any) {
        let jsonDecoder = new JsonDecoder(this.entityMap, this.revertMap);
        let jsonMessage = jsonDecoder.decode(message);
        this.eventAggregator.publish(jsonMessage["event"], jsonMessage["payload"]);
    }

    public close(): void {
        this.endpoint.close();
        this.eventAggregator.publish(WebsocketClient.DISCONNECTED_EVENT, this);
    }

    public send(data: any): void {
        let message = data;
        if (typeof data === "object") {
            message = new JsonEncoder(this.entityMap).encode(data);
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
