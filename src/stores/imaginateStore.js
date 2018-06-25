import { observable, action, computed } from "mobx";

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
    this.service.predict(this.serviceSettings);
  }

  @computed
  get serviceSettings() {
    let settings = this.settings.default;

    const serviceSettings = this.settings.services.some(service => {
      return service.name === this.service.name;
    });

    if (serviceSettings) settings = serviceSettings;

    return settings;
  }
}

export default new imaginateStore();
