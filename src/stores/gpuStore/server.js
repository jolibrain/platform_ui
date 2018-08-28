import { observable, action } from "mobx";
import agent from "../../agent";

export default class GpuStatServer {
  @observable gpuInfo = null;
  @observable recommendedGpuIndex = -1;
  @observable error = false;

  constructor(opts) {
    this.name = opts.name;
    this.url = opts.url;
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
    return agent.GpuInfo.get(this.url);
  }
}
