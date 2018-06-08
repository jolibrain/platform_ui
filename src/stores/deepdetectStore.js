import { observable, action, computed } from "mobx";

import deepdetectServer from "./deepdetect/server";

export class deepdetectStore {
  @observable settings = {};

  @observable servers = [];
  @observable currentServerIndex = -1;

  @observable refresh = 0;

  @computed
  currentServer() {
    return this.servers[this.currentServerIndex];
  }

  @computed
  currentService() {
    const server = this.servers[this.currentServerIndex];
  }

  @action
  setup(configStore) {
    this.settings = configStore.deepdetect;
    this.settings.servers.forEach(serverConfig => {
      this.servers.push(new deepdetectServer(serverConfig));
    });
    this.loadServices();
  }

  @action
  setCurrentServerIndex(serverIndex) {
    this.currentServerIndex = serverIndex;
  }

  @action
  setCurrentServer(serverName) {
    this.currentServerIndex = this.servers.findIndex(
      server => server.name === serverName
    );
  }

  @action
  setCurrentServiceIndex(serviceIndex) {
    const server = this.servers[this.currentServerIndex];
    server.setCurrentServiceIndex(serviceIndex);
  }

  @action
  setCurrentService(serviceName) {
    const server = this.servers[this.currentServerIndex];
    server.setCurrentService(serviceName);
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
    const server = this.servers[this.currentServerIndex];
    server.newService(name, data, callback);
  }
}

export default new deepdetectStore();
