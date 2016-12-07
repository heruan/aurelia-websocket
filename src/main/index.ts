import { FrameworkConfiguration } from "aurelia-framework";
import { WebsocketClient } from "./websocket-client";

export function configure(frameworkConfiguration: FrameworkConfiguration, pluginConfiguration: (instance: WebsocketClient) => Promise<WebsocketClient>) {
    let instance = frameworkConfiguration.container.get(WebsocketClient);
    return pluginConfiguration(instance);
}

export { WebsocketClient };
