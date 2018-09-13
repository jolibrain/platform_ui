import { observable, action } from "mobx";
import agent from "../../agent";

import Repository from "./repository";

export default class RepositoryStore {
  @observable name;
  @observable nginxPath;
  @observable systempPath;

  @observable fetchFiles = false;
  @observable isTraining = false;

  @observable repositories = [];

  constructor(config) {
    this.name = config.name;
    this.nginxPath = config.nginxPath;
    this.systemPath = config.systemPath;

    this.isTraining =
      typeof config.isTraining === "undefined" ? false : config.isTraining;

    this._loadRepositories(this.nginxPath);
  }

  @action
  _loadRepositories(path) {
    this.$reqFolder(path).then(content => {
      const { folders, files } = content;

      folders.forEach(f => this._loadRepositories(path + f.name + "/"));

      if (
        files.includes("model.json") ||
        files.includes("deploy.prototxt") ||
        files.includes("config.json")
      ) {
        this.repositories.push(new Repository(path, files, this));
      }
    });
  }

  $reqFolder(path) {
    return agent.Webserver.listFolders(path);
  }
}
