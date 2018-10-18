import { observable, action, computed } from "mobx";

export class imaginateStore {
  @observable settings = {};

  @observable server = null;
  @observable service = null;

  @action
  setup(configStore) {
    this.settings = configStore.imaginate;
  }

  @action
  connectToDdStore(deepdetectStore) {
    const { server } = deepdetectStore;
    this.server = server;
    this.service = server.service;
  }

  @action
  predict() {
    this.service.predict(this.serviceSettings);
  }

  @computed
  get serviceSettings() {
    let settings = this.settings.default;

    const existingService = this.settings.services.find(service => {
      return service.name === this.service.name;
    });

    if (existingService) settings = existingService.settings;

    return settings;
  }
}

export default new imaginateStore();
