import { observable, action, computed } from "mobx";

import RepositoryStore from "./modelRepositories/repositoryStore";

export class modelRepositoriesStore {
  @observable repositoryStores = [];

  @action
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

  // Refresh Status
  // when true, it is fetching models from webserver

  @computed
  get isRefreshing() {
    return this.repositoryStores.some(r => r.isRefreshing);
  }

  @computed
  get isRefreshingPredict() {
    return this.repositoryStores
      .filter(r => !r.isTraining)
      .some(r => r.isRefreshing);
  }

  @computed
  get isRefreshingTraining() {
    return this.repositoryStores
      .filter(r => r.isTraining)
      .some(r => r.isRefreshing);
  }

  // Ready Status
  // when true, models have been fetched from webserver

  @computed
  get isReady() {
    return this.repositoryStores.every(r => r.isReady);
  }

  @computed
  get isReadyPredict() {
    return this.repositoryStores
      .filter(r => !r.isTraining)
      .every(r => r.isReady);
  }

  @computed
  get isReadyTraining() {
    return this.repositoryStores
      .filter(r => r.isTraining)
      .every(r => r.isReady);
  }

  @computed
  get repositories() {
    return Array.prototype.concat.apply(
      [],
      this.repositoryStores.map(r => r.repositories)
    );
  }

  @computed
  get predictRepositories() {
    return Array.prototype.concat.apply(
      [],
      this.repositoryStores.filter(r => !r.isTraining).map(r => r.repositories)
    );
  }

  @computed
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

  @computed
  get publicRepositories() {
    return this.storeRepositories("public");
  }

  @computed
  get privateRepositories() {
    return this.storeRepositories("private");
  }

  @computed
  get archivedTrainingRepositories() {
    return this.trainingRepositories.length > 0
      ? this.trainingRepositories.filter(r => r.jsonMetrics || r.bestModel)
      : [];
  }
}

export default new modelRepositoriesStore();
