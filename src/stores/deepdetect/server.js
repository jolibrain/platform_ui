import { makeAutoObservable } from "mobx";
import agent from "../../agent";

import deepdetectService from "./service";

export default class deepdetectServer {
  name = "";
  settings = {};

  isActive = false;
  services = [];

  respInfo = null;

  constructor(opts) {
    makeAutoObservable(this);
    this.name = opts.name;
    this.settings = opts.settings;
  }

  get infoPath() {
    return `${this.settings.path}/info`;
  }

  get service() {
    return this.services.find(s => s.isActive);
  }

  get isWritable() {
    return this.settings.isWritable;
  }

  setServiceIndex(serviceIndex) {
    const currentServiceIndex = this.services.findIndex(s => s.isActive);
    if (currentServiceIndex !== serviceIndex) {
      this.services[currentServiceIndex].isActive = true;
      this.services[serviceIndex].isActive = true;
    }
  }

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

  get isDown() {
    if (!this.respInfo) return true;
    return !(this.respInfo.head && this.respInfo.head.services);
  }

  get respInfoServices() {
    if (!this.respInfo || !this.respInfo.head || !this.respInfo.head.services)
      return [];
    return this.respInfo.head.services;
  }

  get respInfoServiceNames() {
    return this.respInfoServices.map(s => s.name);
  }

  _updateRespInfo(respInfo) {
    this.respInfo = respInfo;
  }

  _updateIsReady() {
    this.isReady = true;
  }

  _updateServicesList(services) {
    this.services = services;
  }

  _updateServicesListAddService(service) {
    this.services.push(service);
  }

  async loadServices(status = false) {
    try {
      await agent.Deepdetect.info(this.settings)
                 .then(respInfo => this._updateRespInfo(respInfo))

      if (!this.isDown) {
        this._updateServicesList(
          this.services
              .slice()
              .filter(s => this.respInfoServiceNames.includes(s.name))
        );

        this.respInfoServices.forEach(serviceSettings => {
          let existingService = this.services.find(
            s => s.name === serviceSettings.name
          );

          if (existingService) {
            existingService._updateSettings(serviceSettings);
          } else if (this.isWritable) {
            const service = new deepdetectService({
              serviceSettings: serviceSettings,
              serverName: this.name,
              serverSettings: this.settings
            });
            this._updateServicesListAddService(service);
          }
        });
      }
    } catch (err) {
      switch (err.name) {
        case "Error":
          if (err.message === "timeout") {
            console.log("timeout on server " + this.name + " loadServices()");
          } else {
            console.log("Uncatched error: " + err.message);
          }
          break;
        case "SyntaxError":
          // typical 502 error code, server is responding
          // with an html page
          break;
        default:
          // uncatched error
          console.log(err.name);
          console.log(err.message);
      }
    }
  }

  async newService(name, data, callback) {
    let response = null;
    let error = null;
    try {
      response = await this.$reqPutService(name, data);
      await this.loadServices();
    } catch (e) {
      error = e;
    }
    callback(response, error);
  }

  async deleteService(serviceName, callback) {
    if (!this.isWritable) return null;

    const service = this.services.find(s => s.name === serviceName);
    if (service) {
      service.removeStore();
    }

    const resp = await this.$reqDeleteService(serviceName);
    await this.loadServices();
    if (callback && typeof callback === "function") callback(resp);
  }

  stopTraining(callback) {
    this.service.stopTraining(callback);
    this.loadServices();
  }
}
