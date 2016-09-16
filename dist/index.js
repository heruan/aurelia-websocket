"use strict";
var aurelia_http_client_1 = require("aurelia-http-client");
var websocket_client_1 = require("./websocket-client");
exports.WebsocketClient = websocket_client_1.WebsocketClient;
function configure(frameworkConfiguration, pluginConfiguration) {
    var container = frameworkConfiguration.container;
    var httpClient = container.get(aurelia_http_client_1.HttpClient);
    var instance = new websocket_client_1.WebsocketClient(httpClient);
    container.registerInstance(websocket_client_1.WebsocketClient, instance);
    return pluginConfiguration(instance);
}
exports.configure = configure;
//# sourceMappingURL=index.js.map