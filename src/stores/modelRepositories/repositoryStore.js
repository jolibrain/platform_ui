import { observable, action } from "mobx";
import agent from "../../agent";

import Repository from "./repository";

export default class RepositoryStore {
  @observable name;
  @observable nginxPath;
  @observable systempPath;

  @observable isRefreshing = false;
  @observable isTraining = false;

  @observable repositories = [];

  constructor(config) {
    this.name = config.name;
    this.nginxPath = config.nginxPath;
    this.systemPath = config.systemPath;

    this.isTraining =
      typeof config.isTraining === "undefined" ? false : config.isTraining;

    this.load();
  }

  @action
  load() {
    this._loadRepositories(this.nginxPath);
  }

  @action
  _loadRepositories(path) {
    this.isRefreshing = true;
    this.$reqFolder(path).then(content => {
      const { folders, files } = content;

      folders.forEach(f => this._loadRepositories(path + f.name + "/"));

      if (
        !this.repositories.find(r => r.path === path) &&
        (files.includes("model.json") ||
          files.includes("deploy.prototxt") ||
          files.includes("config.json") ||
          files.includes("metrics.json") ||
          files.includes("best_model.txt"))
      ) {
        this.repositories.push(new Repository(path, files, this));
      }
      this.isRefreshing = false;
    });
  }

  $reqFolder(path) {
    return agent.Webserver.listFolders(path);
  }
}
