import { observable, action } from "mobx";
import agent from "../agent";

export class GpuStore {
  @observable gpuInfo = null;
  @observable settings = {};

  @observable recommendedGpuIndex = -1;

  @observable error = false;

  @action
  setup(configStore) {
    this.settings = configStore.gpuInfo;
  }

  @action
  loadGpuInfo() {
    this.$reqGpuInfo().then(
      action(gpuInfo => {
        if (gpuInfo) {
          this.error = false;
          this.gpuInfo = gpuInfo;

          const sortedMemoryGpus = gpuInfo.gpus
            .map(g => {
              return {
                index: g.index,
                memoryAvailable: g["memory.total"] - g["memory.used"]
              };
            })
            .sort((a, b) => {
              return b.memoryAvailable - a.memoryAvailable;
            });

          this.recommendedGpuIndex = sortedMemoryGpus[0].index;
        } else {
          this.error = true;
        }
      })
    );
  }

  $reqGpuInfo() {
    return agent.GpuInfo.get(this.settings);
  }
}

export default new GpuStore();
