import { FrameworkConfiguration } from "aurelia-framework";
import { WebsocketClient } from "./websocket-client";
export declare function configure(frameworkConfiguration: FrameworkConfiguration, pluginConfiguration: (instance: WebsocketClient) => Promise<WebsocketClient>): Promise<WebsocketClient>;
export { WebsocketClient };
