import { observable, action } from "mobx";
import agent from "../agent";

export class configStore {
  @observable isReady = false;

  @observable layout = "full";

  @observable
  common = {
    name: "DeepDetect",
    gitCommitHash: null
  };

  @observable
  homeComponent = {
    contentType: "json", // TODO: more content types
    title: "DeepDetect Platform",
    description: "Welcome to deepdetect",
    headerLinks: {
      linkJupyter: "/code/lab",
      linkMenus: []
    }
  };

  @observable
  deepdetect = {
    server: {
      path: "/api"
    },
    services: {
      defaultService: null,
      defaultConfig: null
    }
  };

  @observable
  gpuInfo = {
    refreshRate: 5000
  };

  @observable
  imaginate = {
    initImages: []
  };

  @observable
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

  @observable
  dataRepositories = {
    nginxPath: "/data/",
    systemPath: "/opt/platform/data/"
  };

  @observable
  datasets = {
    nginxPath: "/data/datasets/",
    systemPath: "/opt/platform/data/datasets/"
  };

  @observable
  modals = [];

  @observable
  componentBlacklist = [];

  @observable
  placeholders = {};

  $reqConfig(path) {
    return agent.Config.get();
  }

  @action
  loadConfig(callbackAfterLoad = () => {}) {
    this.$reqConfig().then(
      action(config => {
        if (config) {
          this.layout = config.layout ? config.layout : this.layout;

          this.common = config.common ? config.common : this.common;

          this.gpuInfo = config.gpuInfo ? config.gpuInfo : this.gpuInfo;

          this.deepdetect = config.deepdetect
            ? config.deepdetect
            : this.deepdetect;

          this.imaginate = config.imaginate ? config.imaginate : this.imaginate;

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

        callbackAfterLoad(this);
      })
    );
  }

  isComponentBlacklisted(componentName) {
    return this.componentBlacklist.includes(componentName);
  }
}

export default new configStore();
