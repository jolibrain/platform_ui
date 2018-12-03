import { observable, action } from "mobx";
import async from "async";

import GpuStatServer from "./server";

export class GpuStore {
  @observable refreshRate = 5000;
  @observable servers = [];

  @observable firstLoad = true;

  @action
  setup(configStore) {
    const { gpuInfo } = configStore;
    this.refreshRate = gpuInfo.refreshRate;

    if (gpuInfo.servers && gpuInfo.servers.length > 0) {
      gpuInfo.servers.forEach(serverConfig => {
        this.servers.push(new GpuStatServer(serverConfig));
      });
    }
  }

  @action
  loadGpuInfo() {
    async.forever(
      next => {
        const seriesArray = this.servers.map(s => {
          return async callback => {
            await s.loadGpuInfo();

            if (this.firstLoad) {
              callback();
            } else {
              setTimeout(() => callback(), 500);
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
            next();
          });
        }
      },
      errorForever => {}
    );
  }
}

export default new GpuStore();
