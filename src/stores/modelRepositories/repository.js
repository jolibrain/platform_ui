import { observable, action, runInAction } from "mobx";
import agent from "../../agent";

export default class Repository {
  @observable folderName;
  @observable name;
  @observable store;

  @observable jsonConfig = null;
  @observable jsonMetrics = null;
  @observable bestModel = null;

  @observable files = [];

  constructor(folderName, store) {
    this.folderName = folderName;
    this.name = folderName.slice(0, -1);
    this.store = store;

    this._load();
  }

  _load() {
    this._loadJsonConfig();

    if (this.store.isTraining) {
      this._loadJsonMetrics();
      this._loadBestModel();
    }

    if (this.store.hasFiles) {
      this._loadFiles();
    }
  }

  @action.bound
  async _loadFiles() {
    const repoFiles = await this.$reqFiles();

    const protoTxtFiles = repoFiles.filter(f => f.includes("prototxt"));
    const caffemodelFile = repoFiles
      .filter(f => f.includes("caffemodel"))
      .sort((a, b) => {
        return parseInt(b.match(/\d+/), 10) - parseInt(a.match(/\d+/), 10);
      })
      .slice(0, 1);

    this.files = protoTxtFiles.concat(caffemodelFile).map(f => {
      return {
        filename: f,
        url: this.store.nginxPath + this.folderName + f
      };
    });
  }

  @action.bound
  async _loadJsonConfig() {
    try {
      this.jsonConfig = await this.$reqJsonConfig();
      // TODO : remove this line when config.json editable
      this.jsonConfig.parameters.mllib.gpuid = 0;
    } catch (e) {}
  }

  @action.bound
  async _loadJsonMetrics() {
    try {
      this.jsonMetrics = await this.$reqJsonMetrics();
    } catch (e) {}
  }

  @action
  async _loadBestModel() {
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

  $reqJsonMetrics() {
    return agent.Webserver.getFile(
      `${this.store.nginxPath}${this.folderName}metrics.json`
    );
  }

  $reqBestModel() {
    return agent.Webserver.getFile(
      `${this.store.nginxPath}${this.folderName}best_model.txt`
    );
  }

  $reqJsonConfig() {
    return agent.Webserver.getFile(
      `${this.store.nginxPath}${this.folderName}config.json`
    );
  }

  $reqFiles() {
    return agent.Webserver.listFiles(this.store.nginxPath + this.folderName);
  }
}
