import { observable, action } from "mobx";
import agent from "../../agent";
import path from "path";

import Repository from "./repository";

export default class RepositoryStore {
  @observable name;
  @observable nginxPath;
  @observable jsonPath;
  @observable systempPath;

  @observable isReady = false;
  @observable isRefreshing = false;
  @observable isTraining = false;

  @observable repositories = [];

  constructor(config) {
    this.name = config.name;
    this.nginxPath = config.nginxPath;
    this.jsonPath = config.jsonPath;
    this.systemPath = config.systemPath;

    this.isTraining =
      typeof config.isTraining === "undefined" ? false : config.isTraining;
  }

  @action
  async load() {
    this.isRefreshing = true;

    let repositories = await this._loadRepositories(
      this.jsonPath,
      true // is root path
    );

    // flatten repositories array
    if (repositories && repositories.length > 0) {
      while (repositories.find(r => r.constructor.name === "Array")) {
        repositories = [].concat.apply([], repositories).filter(r => r);
      }
    }

    this.repositories = repositories;
    this.isReady = true;
    this.isRefreshing = false;
  }

  @action
  async _loadRepositories(rootPath, isRoot = false) {
    let folders = [],
      files = [];

    try {
      const result = await this.$reqFolder(rootPath);
      folders = result.folders;
      files = result.files;
    } catch (err) {
      return [];
    }

    const isRepository =
      files.includes("model.json") ||
      files.includes("deploy.prototxt") ||
      files.includes("config.json") ||
      files.includes("metrics.json") ||
      files.includes("best_model.txt");

    if (isRepository && !isRoot) {
      const repository = new Repository(rootPath, files, this);
      return [repository];
    } else if (folders.length > 0) {
      let repositories = await Promise.all(
        folders.map(async f => {
          return await this._loadRepositories(path.join(rootPath, f.href, "/"));
        })
      );

      return repositories.length > 0 ? repositories : [];
    } else {
      return [];
    }
  }

  $reqFolder(rootPath) {
    return agent.Webserver.listFolders(rootPath);
  }
}
