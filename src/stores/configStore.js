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
    nginxPath: "/model_repositories/",
    systemPath: "/data/models/"
  };

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
        this.homeComponent = config.homeComponent;
        callback(this);
      })
    );
  }
}

export default new configStore();
