import {FrameworkConfiguration} from "aurelia-framework";
import {Container} from "aurelia-dependency-injection";
import {HttpClient} from "aurelia-http-client";
import {WebsocketClient} from "./websocket-client";

export function configure(frameworkConfiguration: FrameworkConfiguration, pluginConfiguration: (instance: WebsocketClient) => Promise<WebsocketClient>) {
    let container: Container = frameworkConfiguration.container;
    let httpClient = container.get(HttpClient);
    let instance = new WebsocketClient(httpClient);
    container.registerInstance(WebsocketClient, instance);
    return pluginConfiguration(instance);
}

export {WebsocketClient};
