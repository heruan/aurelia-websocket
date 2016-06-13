define(["exports", "aurelia-http-client", "./websocket-client"], function (exports, _aureliaHttpClient, _websocketClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.WebsocketClient = undefined;
    exports.configure = configure;
    function configure(frameworkConfiguration, pluginConfiguration) {
        var container = frameworkConfiguration.container;
        var httpClient = container.get(_aureliaHttpClient.HttpClient);
        var instance = new _websocketClient.WebsocketClient(httpClient);
        container.registerInstance(_websocketClient.WebsocketClient, instance);
        return pluginConfiguration(instance);
    }
    exports.WebsocketClient = _websocketClient.WebsocketClient;
});