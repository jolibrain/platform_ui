import { observable, action } from "mobx";
import agent from "../agent";

export class deepdetectStore {
  @observable isLoading = false;
  @observable servicesLoaded = false;

  @observable services = [];
  @observable creatingService = false;
  @observable currentServiceIndex = -1;

  @observable settings = {};

  @action
  setup(configStore) {
    this.settings = configStore.deepdetect;
    this.loadServices();
  }

  @action
  setCurrentServiceIndex(currentServiceIndex) {
    this.currentServiceIndex = currentServiceIndex;
  }

  @action
  setCurrentService(serviceName) {
    this.currentServiceIndex = this.services.findIndex(service => {
      return service.name === serviceName;
    });
  }

  $reqInfo() {
    return agent.Deepdetect.info(this.settings);
  }

  $reqInfoStatus() {
    return agent.Deepdetect.infoStatus(this.settings);
  }

  $reqPutService(name, data) {
    return agent.Deepdetect.putService(this.settings, name, data);
  }

  @action
  async loadServices(status = false) {
    let info;

    if (status) {
      info = await this.$reqInfo();
    } else {
      info = await this.$reqInfoStatus();
    }

    if (info.head && info.head.services) {
      this.services = info.head.services;
    }

    if (this.services.length > 0 && this.currentServiceIndex === -1)
      this.currentServiceIndex = 0;

    this.servicesLoaded = true;
  }

  @action
  async newService(name, data, callback) {
    const resp = await this.$reqPutService(name, data);
    callback(resp);
  }
}

export default new deepdetectStore();
