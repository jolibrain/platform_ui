import { observable, action, computed } from "mobx";

export class imaginateStore {
  @observable settings = {};

  @observable server = null;

  @action
  setup(configStore) {
    this.settings = configStore.imaginate;
  }

  @action
  connectToDdStore(deepdetectStore) {
    const { server } = deepdetectStore;
    this.server = server;
  }

  @action
  predict() {
    this.server.service.predict(this.serviceSettings);
  }

  @computed
  get serviceSettings() {
    let settings = this.settings.default;

    const existingService = this.settings.services.find(service => {
      return service.name === this.server.service.name;
    });

    if (existingService) settings = existingService.settings;

    return settings;
  }

  @computed
  get service() {
    return this.server.service;
  }
}

export default new imaginateStore();
