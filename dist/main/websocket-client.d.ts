import { HttpClient } from "aurelia-http-client";
import { JsonDecoder } from "aurelia-json";
export declare class WebsocketClient {
    static USERS_EVENT: string;
    static CONNECTED_EVENT: string;
    static DISCONNECTED_EVENT: string;
    users: Set<Object>;
    private eventAggregator;
    private httpClient;
    private jsonDecoder;
    private endpoint;
    private connected;
    private entityMap;
    private revertMap;
    constructor(httpClient: HttpClient, jsonDecoder: JsonDecoder);
    getUsers(): Set<Object>;
    setUsers(users: Set<Object>): void;
    on(event: string, callback: Function): void;
    connect(url: string, protocols?: string | string[]): Promise<WebsocketClient>;
    private handleMessage(message);
    close(): void;
    send(data: any): void;
    join(channel: string): void;
    leave(channel: string): void;
}
