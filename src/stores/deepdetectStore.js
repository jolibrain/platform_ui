import { observable, action, computed } from "mobx";

import deepdetectServer from "./deepdetect/server";

export class deepdetectStore {
  @observable settings = {};

  @observable servers = [];
  @observable currentServerIndex = -1;

  @observable refresh = 0;
  @observable isReady = false;

  @computed
  get server() {
    if (this.currentServerIndex === -1 || this.servers.length === 0)
      return null;

    return this.servers[this.currentServerIndex];
  }

  @computed
  get writableServer() {
    if (this.currentServerIndex === -1) return null;

    return this.servers.find(s => s.settings.isWritable);
  }

  @computed
  get service() {
    if (
      this.server.currentServiceIndex === -1 ||
      this.server.services.length === 0
    )
      return null;

    return this.server.services[this.server.currentServiceIndex];
  }

  @action
  setup(configStore) {
    this.settings = configStore.deepdetect;

    this.settings.servers.forEach(serverConfig => {
      this.servers.push(new deepdetectServer(serverConfig));
    });

    if (this.servers.length > 0 && this.currentServerIndex === -1) {
      this.currentServerIndex = 0;
    }

    this.loadServices();
  }

  @action
  init(params) {
    this.currentServerIndex = -1;

    this.currentServerIndex = this.servers.findIndex(
      server => server.name === params.serverName
    );

    if (this.currentServerIndex !== -1) {
      this.server.currentServerIndex = -1;
      this.server.setService(params.serviceName);
    }

    return (
      this.currentServerIndex !== -1 && this.server.currentServiceIndex !== -1
    );
  }

  @action
  setServerIndex(serverIndex) {
    this.currentServerIndex = serverIndex;
  }

  @action
  setServer(serverName) {
    this.currentServerIndex = this.servers.findIndex(
      server => server.name === serverName
    );
  }

  @action
  setServiceIndex(serviceIndex) {
    this.server.setServiceIndex(serviceIndex);
  }

  @action
  setService(serviceName) {
    this.server.setService(serviceName);
  }

  @action
  loadServices(status) {
    const promises = [];
    this.servers.forEach(async server => {
      const promise = server.loadServices(status);
      promises.push(promise);
    });
    Promise.all(promises).then(results => {
      this.isReady = true;
      this.refresh = Math.random();
    });
  }

  @action
  newService(name, data, callback) {
    this.writableServer.newService(name, data, callback);
  }

  @action
  deleteService(callback) {
    this.writableServer.deleteService(callback);
    this.loadServices();
  }

  @action
  stopTraining(callback) {
    this.service.stopTraining(callback);
    this.loadServices();
  }
}

export default new deepdetectStore();
