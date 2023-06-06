import { observable, action, computed } from "mobx";
import async from "async";
import agent from "../agent";

import deepdetectServer from "./deepdetect/server";

export class deepdetectStore {
  @observable settings = {};

  @observable servers = [];
  @observable chains = [];

  @observable refresh = 0;
  @observable isReady = false;
  @observable firstLoad = true;

  @observable trainRefreshMode = null;

  @action
  setTrainRefreshMode(mode) {
    this.trainRefreshMode = mode;
  }

  @computed
  get server() {
    return this.servers.find(s => s.isActive);
  }

  // content of dd_server/info
  @computed
  get service() {
    return this.server.service;
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
    return [].concat
      .apply(
        [],
        this.servers.map(s => s.services)
      )
      .sort((a, b) => {
        // Sort by name
        var nameA = a.settings.name.toUpperCase();
        var nameB = b.settings.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });
  }

  @computed
  get predictServices() {
    return this.services.filter(s => !s.isTraining);
  }

  @computed
  get trainingServices() {
    return this.services.filter(s => s.isTraining);
  }

  @action
  async setup(configStore) {
    this.settings = configStore.deepdetect;

    if (this.settings.servers) {
      this.settings.servers.forEach(serverConfig => {
        this.servers.push(observable(new deepdetectServer(serverConfig)));
      });
    }

    // Set first server as default server
    if (this.servers.length > 0 && !this.server) {
      this.servers[0].isActive = true;
    }

    // List available chains
    if (this.settings.chains && this.settings.chains.path) {
      const path = this.settings.chains.path;
      const chainFiles = await agent.Webserver.listFiles(path);

      // filter temp files - ending with ~ symbol - from chainFiles
      // and load corresponding file in this.chains array
      chainFiles
        .filter(chainName => /~$/.test(chainName) === false)
        .forEach(async (chainFile, index) => {
          const chainPath = path + chainFile;
          const chainContent = await agent.Webserver.getFile(chainPath);
          this.chains.push({
            name: chainContent.name,
            content: chainContent,
            path: chainPath
          });
        });
    }
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
      server.setService(encodeURIComponent(params.serviceName));
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
  setServerPath(serverPath) {
    this.servers.forEach(s => (s.isActive = false));
    let server = this.servers.find(s => s.settings.path === serverPath);
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
    async.forever(
      next => {
        const seriesArray = this.servers.map(s => {
          return async (callback) => {
            await s.loadServices(status)
            callback(null)
          };
        });

        if (!this.isReady) {
          async.parallel(seriesArray, (errorSeries, results) => {
            this.isReady = true;
            next();
          });
        } else {
          async.series(seriesArray, (errorSeries, results) => {
            this.refresh = Math.random();
            let refreshRate = 500;

            if (
              this &&
              this.settings &&
              this.settings.refreshRate &&
              this.settings.refreshRate.info &&
              parseInt(this.settings.refreshRate.info, 10) > 0
            )
              refreshRate = this.settings.refreshRate.info;

            setTimeout(() => next(), refreshRate);
          });
        }
      },
      errorForever => {}
    );
  }

  @action
  refreshTrainInfo() {
    async.forever(
      next => {
        let services = [];
        switch (this.trainRefreshMode) {
          case "services":
            services = this.trainingServices;
            break;
          case "service":
            services = [this.service];
            break;
          default:
            break;
        }

        const seriesArray = services.map(s => {
          return async callback => {
            try {
              await s.trainInfo();
            } catch (err) {
            } finally {
              callback();
            }
          };
        });

        async.series(seriesArray, (errorSeries, results) => {
          this.refresh = Math.random();

          // Set training info refresh rate using value available
          // in config.json at `deepdetect.refreshRate.training`
          let refreshRate = 500;

          if (
            this &&
              this.settings &&
              this.settings.refreshRate &&
              this.settings.refreshRate.info &&
              parseInt(this.settings.refreshRate.training, 10) > 0
          )
            refreshRate = this.settings.refreshRate.training;

          setTimeout(() => next(), refreshRate);
        });
      },
      errorForever => {}
    );
  }

  @action
  newService(name, data, callback) {
    this.hostableServer.newService(name, data, callback);
  }

  @action
  deleteService(callback) {
    if (this.server.isWritable) {
      this.server.deleteService(this.server.service.name, callback);
    }
  }

  @action
  stopTraining(callback) {
    this.service.stopTraining(callback);
  }
}

export default new deepdetectStore();
