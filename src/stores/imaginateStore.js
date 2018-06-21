import { observable, action } from "mobx";

export class imaginateStore {
  @observable isLoaded = false;
  @observable settings = {};

  @observable server = null;
  @observable service = null;

  @action
  setup(configStore) {
    this.settings = configStore.imaginate;
    this.isLoaded = true;
  }

  @action
  connectToDdStore(deepdetectStore) {
    const { server, service } = deepdetectStore;
    this.server = server;
    this.service = service;
    this.service.selectedInputIndex = -1;
  }

  @action
  predict() {
    this.service.predict(this.settings);
  }
}

export default new imaginateStore();
