import { observable, action, computed } from "mobx";
import agent from "../../agent";

import deepdetectService from "./service";

export default class deepdetectServer {
  @observable name = "";
  @observable settings = {};

  @observable isActive = false;

  @observable isLoading = false;
  @observable servicesLoaded = false;

  @observable serverDown = false;

  @observable services = [];
  @observable creatingService = false;

  constructor(opts) {
    this.name = opts.name;
    this.settings = opts.settings;
  }

  @computed
  get service() {
    return this.services.find(s => s.isActive);
  }

  @action
  setServiceIndex(serviceIndex) {
    this.services.forEach(s => (s.isActive = false));
    this.services[serviceIndex].isActive = true;
  }

  @action
  setService(serviceName) {
    this.services.forEach(s => (s.isActive = false));
    let service = this.services.find(s => s.name === serviceName);
    if (service) service.isActive = true;
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
    try {
      const info = await this.$reqInfo();
      const currentServiceName = this.service ? this.service.name : null;

      if (info.head && info.head.services) {
        this.serverDown = false;
        this.services = info.head.services.map(serviceSettings => {
          return new deepdetectService({
            serviceSettings: serviceSettings,
            serverName: this.name,
            serverSettings: this.settings
          });
        });
      } else {
        this.serverDown = true;
        this.services = [];
      }

      if (currentServiceName) {
        this.services.forEach(s => (s.isActive = false));
        let service = this.services.find(s => s.name === currentServiceName);
        if (service) service.isActive = true;
      }
    } catch (e) {
      this.serverDown = true;
      this.services = [];
    }

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
