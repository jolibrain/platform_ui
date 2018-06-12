import { observable, action, computed } from "mobx";

import deepdetectServer from "./deepdetect/server";

export class deepdetectStore {
  @observable settings = {};

  @observable servers = [];
  @observable currentServerIndex = -1;

  @observable refresh = 0;

  @computed
  get server() {
    if (this.currentServerIndex === -1) return null;

    return this.servers[this.currentServerIndex];
  }

  @computed
  get service() {
    if (this.server.currentServiceIndex === -1) return null;

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
    this.servers.forEach(server => {
      server.loadServices(status);
      this.refresh = Math.random();
    });
  }

  @action
  newService(name, data, callback) {
    this.server.newService(name, data, callback);
  }

  @action
  deleteService(callback) {
    this.server.deleteService(callback);
  }
}

export default new deepdetectStore();
