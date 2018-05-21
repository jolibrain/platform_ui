import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class deepdetectStore {

  @observable isLoading = false;
  @observable servicesRegistry = observable.map();
  @observable service = null;

  @observable settings = {};

  @action setup(configStore) {
    this.settings = configStore.deepdetect;
  }

  @computed get services() {
    return this.servicesRegistry.values();
  };

  @action setService(service) {
    this.service = service;
  }

  clear() {
    this.servicesRegistry.clear();
  }

  $reqInfo() {
    return agent.Deepdetect.info(this.settings);
  }

  $reqPutService(name, data) {
    return agent.Deepdetect.putService(this.settings, name, data);
  }

  @action async loadServices() {
    const info = await this.$reqInfo();
    console.log(info);
    //    info.services.forEach( (service, index) => {
    //      this.servicesRegistry.push(service);
    //    });
  }

  @action async newService(name, data) {
    await this.$reqPutService(name, data);
    this.loadServices();
  }

}

export default new deepdetectStore();
