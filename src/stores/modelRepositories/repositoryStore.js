import { makeAutoObservable } from "mobx";
import agent from "../../agent";
import path from "path";

import Repository from "./repository";

export default class RepositoryStore {
  name;
  nginxPath;
  jsonPath;
  systempPath;

  isReady = false;
  isRefreshing = false;
  isTraining = false;

  repositories = [];

  constructor(config) {
    makeAutoObservable(this);
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

  removeRepository(path) {
    const repositoryIndex = this.repositories.findIndex(r => r.path === path)

    if(repositoryIndex !== -1)
      this.repositories.splice(repositoryIndex, 1)
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

  _updateRepositoriesList(repositories) {
    this.repositories = repositories;
  }

  _updateStartLoading() {
    this.isRefreshing = true;
  }

  _updateEndLoading() {
    this.isReady = true;
    this.isRefreshing = false;
  }

  async load() {
    this._updateStartLoading();

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
    this._updateRepositoriesList([
      ...this.repositories,
      ...repositories.filter(r => !repoPaths.has(r.path))
    ]);

    this._updateEndLoading();
  }

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
