import { observable, action, computed } from "mobx";

import deepdetectServer from "./deepdetect/server";

export class deepdetectStore {
  @observable settings = {};

  @observable servers = [];

  @observable refresh = 0;
  @observable isReady = false;

  @computed
  get server() {
    return this.servers.find(s => s.isActive);
  }

  @computed
  get writableServer() {
    return this.servers.find(s => s.settings.isWritable);
  }

  @computed
  get hostableServer() {
    return this.servers.find(s => s.settings.isHostable);
  }

  @computed
  get services() {
    return [].concat.apply([], this.servers.map(s => s.services));
  }

  @computed
  get predictServices() {
    return this.services.filter(s => !s.settings.training);
  }

  @computed
  get trainingServices() {
    return this.services.filter(s => s.settings.training);
  }

  @action
  setup(configStore) {
    this.settings = configStore.deepdetect;

    if (this.settings.servers) {
      this.settings.servers.forEach(serverConfig => {
        this.servers.push(observable(new deepdetectServer(serverConfig)));
      });
    }

    if (this.servers.length > 0 && !this.server) {
      this.servers[0].isActive = true;
    }

    this.loadServices();
  }

  @action
  init(params) {
    let server = this.servers.find(server => server.name === params.serverName);

    if (server) {
      let activeServer = this.servers.find(s => s.isActive);
      if (activeServer && activeServer.name !== params.serverName) {
        activeServer.isActive = false;
      }

      server.isActive = true;
      server.setService(params.serviceName);
    }

    return server && server.service;
  }

  @action
  setServerIndex(serverIndex) {
    this.servers.forEach(s => (s.isActive = false));
    this.servers[serverIndex].isActive = true;
  }

  @action
  setServer(serverName) {
    this.servers.forEach(s => (s.isActive = false));
    let server = this.servers.find(s => s.name === serverName);
    if (server) server.isActive = true;
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
  loadServices(status = false) {
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
  refreshTrainInfo() {
    const promises = [];
    this.trainingServices.forEach(async service => {
      const promise = service.trainInfo();
      promises.push(promise);
    });
    Promise.all(promises).then(results => {
      this.refresh = Math.random();
    });
  }

  @action
  newService(name, data, callback) {
    this.hostableServer.newService(name, data, callback);
  }

  @action
  deleteService(callback) {
    if (this.server.isWritable) {
      this.server.deleteService(callback);
    }
  }

  @action
  stopTraining(callback) {
    this.service.stopTraining(callback);
    this.loadServices();
  }
}

export default new deepdetectStore();
