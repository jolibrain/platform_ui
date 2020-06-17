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

  repositoryExists(path) {
    return this.repositories.some(r => r.path === path);
  }

  _isRepository(fileList) {
    return (
      fileList.includes("model.json") ||
      fileList.includes("deploy.prototxt") ||
      fileList.includes("config.json") ||
      fileList.includes("metrics.json") ||
      fileList.includes("best_model.txt")
    );
  }

  // Fast load an unique repository
  @action
  async fastLoad(repoPath) {
    let files = [],
      repository = null;

    try {
      const result = await this.$reqFolder(repoPath);
      files = result.files;

      if (this._isRepository(files) && !this.repositoryExists(repoPath)) {
        repository = new Repository(repoPath, files, this);
        this.repositories = [repository];
      }
    } catch (err) {
      console.log(
        `Error while fast-loading repository from repositoryStore - path: ${repoPath}`
      );
    }

    return repository;
  }

  @action
  async load() {
    this.isRefreshing = true;

    let repositories = await this._loadRepositories(
      this.nginxPath,
      true // is root path
    );

    // flatten repositories array
    if (repositories && repositories.length > 0) {
      while (repositories.find(r => r.constructor.name === "Array")) {
        repositories = [].concat.apply([], repositories).filter(r => r);
      }
    }

    // Merge new repositories
    const repoPaths = new Set(this.repositories.map(r => r.path));
    this.repositories = [
      ...this.repositories,
      ...repositories.filter(r => !repoPaths.has(r.path))
    ];

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

    if (this._isRepository(files) && !isRoot) {
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
