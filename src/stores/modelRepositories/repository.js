import { observable, action, computed, runInAction } from "mobx";
import agent from "../../agent";

export default class Repository {
  @observable modelName = "";
  @observable isPublic = true;
  @observable isTraining = false;
  @observable settings = {};

  @observable jsonConfig = null;
  @observable jsonMetrics = null;
  @observable bestModel = null;

  @observable repoFiles = [];

  constructor(
    opts = {
      repo: "",
      isPublic: true,
      isTraining: false,
      settings: {},
      files: []
    }
  ) {
    this.repo = opts.repo;
    this.isPublic = typeof opts.isPublic === "undefined" ? true : opts.isPublic;
    this.isTraining =
      typeof opts.isTraining === "undefined" ? false : opts.isTraining;
    this.settings = typeof opts.settings === "undefined" ? {} : opts.settings;
    this.repoFiles = typeof opts.files === "undefined" ? [] : opts.files;

    this.loadJsonConfig();

    if (this.isTraining) {
      this.loadJsonMetrics();
      this.loadBestModel();
    }
  }

  @computed
  get name() {
    return this.systemPath
      .slice(0, -1)
      .split("/")
      .pop();
  }

  @computed
  get files() {
    const protoTxtFiles = this.repoFiles.filter(f => f.includes("prototxt"));
    const caffemodelFile = this.repoFiles
      .filter(f => f.includes("caffemodel"))
      .sort((a, b) => {
        return parseInt(b.match(/\d+/), 10) - parseInt(a.match(/\d+/), 10);
      })
      .slice(0, 1);

    return protoTxtFiles.concat(caffemodelFile).map(f => {
      return {
        filename: f,
        url: this.nginxPath.private + this.repo + f
      };
    });
  }

  @computed
  get systemPath() {
    let path = null;
    const { systemPath } = this.settings;

    if (systemPath) {
      if (this.isTraining) {
        path = systemPath.training + this.repo;
      } else if (this.isPublic) {
        path = systemPath.public + this.repo;
      } else {
        path = systemPath.private + this.repo;
      }
    }

    return path;
  }

  @computed
  get nginxPath() {
    let path = null;
    const { nginxPath } = this.settings;

    if (nginxPath) {
      if (this.isTraining) {
        path = nginxPath.training + this.repo;
      } else if (this.isPublic) {
        path = nginxPath.public + this.repo;
      } else {
        path = nginxPath.private + this.repo;
      }
    }

    return path.replace(/\/$/, "");
  }

  @action.bound
  async loadJsonConfig() {
    try {
      this.jsonConfig = await this.$reqJsonConfig();
      // TODO : remove this line when config.json editable
      this.jsonConfig.parameters.mllib.gpuid = 0;
    } catch (e) {}
  }

  @action.bound
  async loadJsonMetrics() {
    try {
      this.jsonMetrics = await this.$reqJsonMetrics();
    } catch (e) {}
  }

  @action
  async loadBestModel() {
    try {
      let bestModel = {};
      const bestModelTxt = await this.$reqBestModel();

      // Transform current best_model.txt to json format
      if (bestModelTxt.length > 0) {
        bestModelTxt
          .split("\n")
          .filter(a => a.length > 0)
          .map(a => a.split(":"))
          .forEach(content => {
            bestModel[content[0]] = content[1];
          });
      }

      runInAction(() => {
        this.bestModel = bestModel;
      });
    } catch (e) {
      //console.log(e);
    }
  }

  $reqJsonMetrics(path) {
    return agent.Webserver.getFile(`${this.nginxPath}/metrics.json`);
  }

  $reqBestModel() {
    return agent.Webserver.getFile(`${this.nginxPath}/best_model.txt`);
  }

  $reqJsonConfig(path) {
    return agent.Webserver.getFile(`${this.nginxPath}/config.json`);
  }
}
