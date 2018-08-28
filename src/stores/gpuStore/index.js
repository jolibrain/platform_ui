import { observable, action } from "mobx";

import GpuStatServer from "./server";

export class GpuStore {
  @observable refreshRate = 5000;
  @observable servers = [];

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
    this.servers.forEach(s => s.loadGpuInfo());
  }
}

export default new GpuStore();
