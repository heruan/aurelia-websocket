System.config({
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.0.1",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.2.1",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.2.5",
    "aurelia-http-client": "npm:aurelia-http-client@1.0.0-beta.1.2.2",
    "aurelia-json": "github:heruan/aurelia-json@0.1.0",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-beta.1.1.0",
    "github:heruan/aurelia-json@0.1.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.0.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.2.5",
      "aurelia-http-client": "npm:aurelia-http-client@1.0.0-beta.1.2.2",
      "http-utils": "github:heruan/http-utils@0.1.0"
    },
    "npm:aurelia-binding@1.0.0-beta.1.3.6": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.2.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.2.1"
    },
    "npm:aurelia-dependency-injection@1.0.0-beta.2.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0"
    },
    "npm:aurelia-event-aggregator@1.0.0-beta.1.2.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.2.1"
    },
    "npm:aurelia-framework@1.0.0-beta.1.2.5": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.3.6",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.2.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.2.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.2.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.2.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.2.7"
    },
    "npm:aurelia-http-client@1.0.0-beta.1.2.2": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.2.2"
    },
    "npm:aurelia-loader@1.0.0-beta.1.2.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.2.2"
    },
    "npm:aurelia-metadata@1.0.0-beta.2.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0"
    },
    "npm:aurelia-polyfills@1.0.0-beta.1.1.0": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.2.0"
    },
    "npm:aurelia-task-queue@1.0.0-beta.1.2.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0"
    },
    "npm:aurelia-templating@1.0.0-beta.1.2.7": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.3.6",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.2.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.2.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.3.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.2.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.2.1"
    }
  }
});
