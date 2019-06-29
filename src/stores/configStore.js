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

  @observable modals = [];

  @observable componentBlacklist = [];

  $req(path) {
    return agent.Config.get();
  }

  @action
  loadConfig(callback = () => {}) {
    this.$req().then(
      action(config => {
        if (config) {
          this.layout = config.layout;
          this.common = config.common;
          this.gpuInfo = config.gpuInfo;
          this.deepdetect = config.deepdetect;
          this.imaginate = config.imaginate;
          this.modelRepositories = config.modelRepositories;
          this.dataRepositories = config.dataRepositories;
          this.homeComponent = config.homeComponent;
          this.modals = config.modals;
          this.componentBlacklist = config.componentBlacklist
            ? config.componentBlacklist
            : [];

          this.isReady = true;
        }
        callback(this);
      })
    );
  }

  isComponentBlacklisted(componentName) {
    return this.componentBlacklist.includes(componentName);
  }
}

export default new configStore();
