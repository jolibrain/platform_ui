import { makeAutoObservable } from "mobx";
import async from "async";

import GpuStatServer from "./server";

export default class GpuStore {
  refreshRate = 5000;
  servers = [];

  firstLoad = true;

  constructor() {
    makeAutoObservable(this);
  }

  setup(configStore) {
    const { gpuInfo } = configStore;
    this.refreshRate = gpuInfo.refreshRate;

    if (gpuInfo.servers && gpuInfo.servers.length > 0) {
      gpuInfo.servers.forEach(serverConfig => {
        this.servers.push(new GpuStatServer(serverConfig));
      });
    }
  }

  loadGpuInfo() {
    async.forever(
      next => {
        const seriesArray = this.servers.map(s => {
          return async callback => {
            try {
              await s.loadGpuInfo();
            } finally {
              callback();
            }
          };
        });

        if (this.firstLoad) {
          async.parallel(seriesArray, (errorSeries, results) => {
            this.firstLoad = false;
            next();
          });
        } else {
          async.series(seriesArray, (errorSeries, results) => {
            setTimeout(() => next(), this.refreshRate);
          });
        }
      },
      errorForever => {}
    );
  }
}
