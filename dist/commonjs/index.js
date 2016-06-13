"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebsocketClient = undefined;
exports.configure = configure;

var _aureliaHttpClient = require("aurelia-http-client");

var _websocketClient = require("./websocket-client");

function configure(frameworkConfiguration, pluginConfiguration) {
    var container = frameworkConfiguration.container;
    var httpClient = container.get(_aureliaHttpClient.HttpClient);
    var instance = new _websocketClient.WebsocketClient(httpClient);
    container.registerInstance(_websocketClient.WebsocketClient, instance);
    return pluginConfiguration(instance);
}
exports.WebsocketClient = _websocketClient.WebsocketClient;