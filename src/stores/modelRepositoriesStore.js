import { observable, action, computed } from "mobx";

import RepositoryStore from "./modelRepositories/repositoryStore";

export class modelRepositoriesStore {
  @observable repositoryStores = [];

  @action
  setup(configStore) {
    this.repositoryStores = configStore.modelRepositories.map(
      repositoryConfig => {
        return new RepositoryStore(repositoryConfig);
      }
    );
    this.refresh();
  }

  refresh() {
    this.repositoryStores.forEach(r => r.load());
  }

  @computed
  get isRefreshing() {
    return this.repositoryStores.map(r => r.isRefreshing).includes(true);
  }

  @computed
  get isReady() {
    return !this.repositoryStores.map(r => r.isReady).includes(false);
  }

  @computed
  get repositories() {
    return Array.prototype.concat.apply(
      [],
      this.repositoryStores.map(r => r.repositories)
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
  get trainingRepositories() {
    return this.storeRepositories("training");
  }

  @computed
  get archivedTrainingRepositories() {
    return this.trainingRepositories.filter(r => r.jsonMetrics || r.bestModel);
  }
}

export default new modelRepositoriesStore();
