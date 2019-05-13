import { observable, action } from "mobx";
import agent from "../../agent";

export default class GpuStatServer {
  @observable gpuInfo = null;
  @observable recommendedGpuIndex = -1;
  @observable error = false;

  constructor(opts) {
    this.name = opts.name;
    this.url = opts.url;
    this.filterOutIndexes = Object.assign([], opts.filterOutIndexes);
  }

  @action
  async loadGpuInfo() {
    const gpuInfo = await this.$reqGpuInfo();

    if (gpuInfo) {
      this.error = false;

      // Filter out some gpu as defined in config.json
      if (this.filterOutIndexes.length > 0) {
        this.filterOutIndexes.forEach(index => {
          gpuInfo.gpus.splice(index, 1);
        });
      }

      this.gpuInfo = gpuInfo;

      if (gpuInfo.gpus && gpuInfo.gpus.length > 0) {
        const sortedMemoryGpus = gpuInfo.gpus
          .map(g => {
            return {
              index: parseInt(g.index, 10),
              memoryAvailable: g["memory.total"] - g["memory.used"]
            };
          })
          .sort((a, b) => {
            return b.memoryAvailable - a.memoryAvailable;
          });

        if (sortedMemoryGpus[0] && sortedMemoryGpus[0].index >= 0) {
          this.recommendedGpuIndex = sortedMemoryGpus[0].index;
        } else {
          this.recommendedGpuIndex = -1;
        }
      }
    } else {
      this.error = true;
    }
  }

  $reqGpuInfo() {
    return agent.GpuInfo.get(this.url);
  }
}
