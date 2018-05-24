import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class deepdetectStore {

  @observable isLoading = false;
  @observable servicesLoaded = false;

  @observable services = [];
  @observable creatingService = false;
  @observable currentServiceIndex = -1;

  @observable settings = {};

  @action setup(configStore) {
    this.settings = configStore.deepdetect;
    this.loadServices();
  }

  @action setCurrentServiceIndex(currentServiceIndex) {
    this.currentServiceIndex = currentServiceIndex;
  }

  @action setCurrentService(serviceName) {
    this.currentServiceIndex = this.services.findIndex( service => {
      return service.name === serviceName;
    });
  }

  $reqInfo() {
    return agent.Deepdetect.info(this.settings);
  }

  $reqPutService(name, data) {
    return agent.Deepdetect.putService(this.settings, name, data);
  }

  @action async loadServices() {
    const info = await this.$reqInfo();

    if (info.head && info.head.services) {
      this.services = info.head.services;
    }

    if (this.services.length > 0 && this.currentServiceIndex === -1)
      this.currentServiceIndex = 0;

    this.servicesLoaded = true;
  }

  @action async newService(name, data) {
    this.creatingService = true;
    await this.$reqPutService(name, data);
    this.creatingService = false;
  }

}

export default new deepdetectStore();
