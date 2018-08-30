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

  @observable isReady = false;

  constructor(config) {
    this.name = config.name;
    this.nginxPath = config.nginxPath;
    this.systemPath = config.systemPath;

    this.hasFiles =
      typeof config.hasFiles === "undefined" ? false : config.hasFiles;
    this.isTraining =
      typeof config.isTraining === "undefined" ? false : config.isTraining;

    this._loadRepositories();
  }

  @action
  _loadRepository(folderName) {
    const repository = new Repository(folderName, this);
    this.repositories.push(repository);
  }

  _loadRepositories() {
    this.$reqFolder().then(repo => {
      repo.forEach(this._loadRepository.bind(this));
      this.isReady = true;
    });
  }

  $reqFolder() {
    return agent.Webserver.listFolders(this.nginxPath);
  }
}
