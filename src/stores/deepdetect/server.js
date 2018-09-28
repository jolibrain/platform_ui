import { observable, action, computed } from "mobx";
import agent from "../../agent";

import deepdetectService from "./service";

export default class deepdetectServer {
  @observable name = "";
  @observable settings = {};

  @observable isLoading = false;
  @observable isActive = false;
  @observable services = [];

  @observable respInfo = null;

  constructor(opts) {
    this.name = opts.name;
    this.settings = opts.settings;
  }

  @computed
  get infoPath() {
    return `${this.settings.path}/info`;
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
    if (currentService && currentService.name !== serviceName) {
      currentService.isActive = false;
    }
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

  @computed
  get isDown() {
    if (!this.respInfo) return true;
    return !(this.respInfo.head && this.respInfo.head.services);
  }

  @computed
  get respInfoServices() {
    if (!this.respInfo || !this.respInfo.head || !this.respInfo.head.services)
      return [];
    return this.respInfo.head.services;
  }

  @computed
  get respInfoServiceNames() {
    return this.respInfoServices.map(s => s.name);
  }

  @action
  async loadServices(status = false) {
    if (this.isLoading) return null;

    try {
      this.isLoading = true;
      this.respInfo = await this.$reqInfo();
      this.isLoading = false;

      if (!this.isDown) {
        this.services = this.services.filter(s =>
          this.respInfoServiceNames.includes(s.name)
        );

        this.respInfoServices.forEach(serviceSettings => {
          let existingService = this.services.find(
            s => s.name === serviceSettings.name
          );

          if (existingService) {
            existingService.settings = serviceSettings;
          } else if (this.isWritable) {
            const service = new deepdetectService({
              serviceSettings: serviceSettings,
              serverName: this.name,
              serverSettings: this.settings
            });
            this.services.push(observable(service));
          }
        });
      }
    } catch (e) {
      this.services = [];
      this.isLoading = false;
    }
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
    if (callback && typeof callback === "function") callback(resp);
  }

  @action
  async stopTraining(callback) {
    this.service.stopTraining(callback);
    await this.loadServices();
  }
}
