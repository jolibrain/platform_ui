import { makeAutoObservable } from "mobx";
import agent from "../agent";

export default class configStore {
  isReady = false;

  layout = "full";

  common = {
    name: "DeepDetect",
    gitCommitHash: null
  };

  homeComponent = {
    contentType: "json", // TODO: more content types
    title: "DeepDetect Platform",
    description: "Welcome to deepdetect",
    headerLinks: {
      linkJupyter: "/code/lab",
      linkMenus: []
    }
  };

  deepdetect = {
    server: {
      path: "/api"
    },
    services: {
      defaultService: null,
      defaultConfig: null
    }
  };

  gpuInfo = {
    refreshRate: 5000
  };

  imaginate = {
    initImages: []
  };

  videoExplorer = null;

  modelRepositories = [
    {
      name: "public",
      nginxPath: "/models/public/",
      jsonPath: "/json/models/public/",
      systemPath: "/opt/platform"
    },
    {
      name: "private",
      nginxPath: "/models/private/",
      jsonPath: "/json/models/private/",
      systemPath: "/opt/platform",
      hasFiles: true
    },
    {
      name: "training",
      nginxPath: "/models/training/",
      jsonPath: "/json/models/training/",
      systemPath: "/opt/platform",
      isTraining: true
    }
  ];

  dataRepositories = {
    nginxPath: "/data/",
    systemPath: "/opt/platform/data/"
  };

  datasets = {
    nginxPath: "/data/datasets/",
    systemPath: "/opt/platform/data/datasets/"
  };

  modals = [];

  componentBlacklist = [];

  placeholders = {};

  constructor() {
    makeAutoObservable(this)
  }

  $reqConfig(path = "/config.json") {
    return agent.Config.get(path);
  }

  _processConfigResponse = config => {
    if (config) {
      this.layout = config.layout ? config.layout : this.layout;

      this.common = config.common ? config.common : this.common;

      this.gpuInfo = config.gpuInfo ? config.gpuInfo : this.gpuInfo;

      this.deepdetect = config.deepdetect
        ? config.deepdetect
        : this.deepdetect;

      this.imaginate = config.imaginate ? config.imaginate : this.imaginate;

      this.videoExplorer = config.videoExplorer ? config.videoExplorer : this.videoExplorer;

      this.modelRepositories = config.modelRepositories
        ? config.modelRepositories
        : this.modelRepositories;

      this.dataRepositories = config.dataRepositories
        ? config.dataRepositories
        : this.dataRepositories;

      this.datasets = config.datasets ? config.datasets : this.datasets;

      this.homeComponent = config.homeComponent
        ? config.homeComponent
        : this.homeComponent;

      this.modals = config.modals ? config.modals : this.modals;

      this.componentBlacklist = config.componentBlacklist
        ? config.componentBlacklist
        : this.componentBlacklist;

      this.placeholders = config.placeholders
        ? config.placeholders
        : this.placeholders;

      this.isReady = true;
    }
  }

  async loadConfig(path = "/config.json") {
    await this.$reqConfig(path)
              .then(this._processConfigResponse)
  }

  isComponentBlacklisted(componentName) {
    return this.componentBlacklist.includes(componentName);
  }
}
