import { observable, action } from "mobx";
import agent from "../agent";

export class configStore {
  @observable configLoaded = false;

  @observable
  homeComponent = {
    contentType: "json", // TODO: more content types
    title: "DeepDetect Platform",
    description: "Welcome to deepdetect"
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
  modelRepositories = {
    nginxPath: {
      public: "/models/public/",
      private: "/models/private/"
    },
    systemPath: {
      public: "/opt/platform/models/public/",
      private: "/opt/platform/models/private/"
    }
  };

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
        this.configLoaded = true;
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
        callback(this);
      })
    );
  }

  isComponentBlacklisted(componentName) {
    return this.componentBlacklist.includes(componentName);
  }
}

export default new configStore();
