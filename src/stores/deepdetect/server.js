import { observable, action, computed } from "mobx";
import agent from "../../agent";

import deepdetectService from "./service";

export default class deepdetectServer {
  @observable name = "";
  @observable settings = {};

  @observable isLoading = false;
  @observable servicesLoaded = false;

  @observable services = [];
  @observable creatingService = false;
  @observable currentServiceIndex = -1;

  constructor(opts) {
    this.name = opts.name;
    this.settings = opts.settings;
  }

  @computed
  get service() {
    if (this.currentServiceIndex === -1) return null;
    return this.services[this.currentServiceIndex];
  }

  @action
  setServiceIndex(currentServiceIndex) {
    this.currentServiceIndex = currentServiceIndex;
  }

  @action
  setService(serviceName) {
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

  $reqDeleteService(name) {
    return agent.Deepdetect.deleteService(this.settings, name);
  }

  @action
  async loadServices(status = false) {
    let info;

    if (!status) {
      info = await this.$reqInfo();
    } else {
      info = await this.$reqInfoStatus();
    }

    if (info.head && info.head.services) {
      this.services = info.head.services.map(service => {
        return new deepdetectService(this.name, service);
      });
    }

    if (this.services.length > 0 && this.currentServiceIndex === -1)
      this.currentServiceIndex = 0;

    this.servicesLoaded = true;
  }

  @action
  async newService(name, data, callback) {
    const resp = await this.$reqPutService(name, data);
    await this.loadServices();
    callback(resp);
  }

  @action
  async deleteService(callback) {
    this.service.removeStore();
    const resp = await this.$reqDeleteService(this.service.name);
    await this.loadServices();
    callback(resp);
  }
}
