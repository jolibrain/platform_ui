import { makeAutoObservable } from "mobx";

import RepositoryStore from "./modelRepositories/repositoryStore";

export default class modelRepositoriesStore {
  repositoryStores = [];

  constructor() {
    makeAutoObservable(this);
  }

  setup(configStore) {
    const { modelRepositories } = configStore;

    if (typeof modelRepositories.map === "function") {
      this.repositoryStores = modelRepositories.map(repositoryConfig => {
        return new RepositoryStore(repositoryConfig);
      });
    }
  }

  refresh() {
    this.repositoryStores.forEach(r => r.load());
  }

  refreshPredict() {
    this.repositoryStores.filter(r => !r.isTraining).forEach(r => r.load());
  }

  refreshTraining() {
    this.repositoryStores.filter(r => r.isTraining).forEach(r => r.load());
  }

  async findAndLoad(path) {
    let repository = null;

    // Get parent folder path
    let parentFolder = path.substring(
      0,
      path.replace(/\/$/, "").lastIndexOf("/")
    );
    if (!parentFolder.endsWith("/")) parentFolder = parentFolder + "/";

    const store = this.repositoryStores.find(r => r.nginxPath === parentFolder);

    if (store) {
      repository = await store.fastLoad(path);
    }

    return repository;
  }

  // Refresh Status
  // when true, it is fetching models from webserver

  get isRefreshing() {
    return this.repositoryStores.some(r => r.isRefreshing);
  }

  get isRefreshingPredict() {
    return this.repositoryStores
      .filter(r => !r.isTraining)
      .some(r => r.isRefreshing);
  }

  get isRefreshingTraining() {
    return this.repositoryStores
      .filter(r => r.isTraining)
      .some(r => r.isRefreshing);
  }

  // Ready Status
  // when true, models have been fetched from webserver

  get isReady() {
    return this.repositoryStores.every(r => r.isReady);
  }

  get isReadyPredict() {
    return this.repositoryStores
      .filter(r => !r.isTraining)
      .every(r => r.isReady);
  }

  get isReadyTraining() {
    return this.repositoryStores
      .filter(r => r.isTraining)
      .every(r => r.isReady);
  }

  get repositories() {
    return Array.prototype.concat.apply(
      [],
      this.repositoryStores.map(r => r.repositories)
    );
  }

  get predictRepositories() {
    return Array.prototype.concat.apply(
      [],
      this.repositoryStores.filter(r => !r.isTraining).map(r => r.repositories)
    );
  }

  get trainingRepositories() {
    return Array.prototype.concat.apply(
      [],
      this.repositoryStores.filter(r => r.isTraining).map(r => r.repositories)
    );
  }

  storeRepositories(storeName) {
    const store = this.repositoryStores.find(r => r.name === storeName);
    return store ? store.repositories : [];
  }

  get publicRepositories() {
    return this.storeRepositories("public");
  }

  get privateRepositories() {
    return this.storeRepositories("private");
  }

  get archivedTrainingRepositories() {
    return this.trainingRepositories.length > 0
      ? this.trainingRepositories.filter(
          r => r.jsonMetrics || r.bestModel || r.fetchError
        )
      : [];
  }
}
