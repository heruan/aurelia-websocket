"use strict";

System.register(["aurelia-http-client", "./websocket-client"], function (_export, _context) {
    "use strict";

    var HttpClient, WebsocketClient;
    return {
        setters: [function (_aureliaHttpClient) {
            HttpClient = _aureliaHttpClient.HttpClient;
        }, function (_websocketClient) {
            WebsocketClient = _websocketClient.WebsocketClient;
        }],
        execute: function () {
            function configure(frameworkConfiguration, pluginConfiguration) {
                var container = frameworkConfiguration.container;
                var httpClient = container.get(HttpClient);
                var instance = new WebsocketClient(httpClient);
                container.registerInstance(WebsocketClient, instance);
                return pluginConfiguration(instance);
            }

            _export("configure", configure);

            _export("WebsocketClient", WebsocketClient);
        }
    };
});