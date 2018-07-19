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

  @computed
  get isWritable() {
    return this.settings.isWritable;
  }

  @action
  setServiceIndex(serviceIndex) {
    const currentServiceIndex = this.services.findIndex(s => s.isActive);
    if (currentServiceIndex !== serviceIndex) {
      this.services[currentServiceIndex].isActive = true;
      this.services[serviceIndex].isActive = true;
    }
  }

  @action
  setService(serviceName) {
    const currentService = this.services.find(s => s.isActive);
    let service = this.services.find(s => s.name === serviceName);
    if (currentService.name !== serviceName && service) {
      currentService.isActive = false;
      service.isActive = true;
    }
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

      if (info.head && info.head.services) {
        this.serverDown = false;

        info.head.services.forEach(serviceSettings => {
          let existingService = this.services.find(
            s => s.name === serviceSettings.name
          );

          if (existingService) {
            existingService.settings = serviceSettings;
          } else {
            const service = new deepdetectService({
              serviceSettings: serviceSettings,
              serverName: this.name,
              serverSettings: this.settings
            });
            this.services.push(service);
          }
        });
      } else {
        this.serverDown = true;
        this.services = [];
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
