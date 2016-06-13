import { HttpClient } from "aurelia-http-client";
import { WebsocketClient } from "./websocket-client";
export function configure(frameworkConfiguration, pluginConfiguration) {
    let container = frameworkConfiguration.container;
    let httpClient = container.get(HttpClient);
    let instance = new WebsocketClient(httpClient);
    container.registerInstance(WebsocketClient, instance);
    return pluginConfiguration(instance);
}
export { WebsocketClient };
//# sourceMappingURL=index.js.map