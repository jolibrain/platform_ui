import { makeAutoObservable } from "mobx";
import agent from "../../agent";

export default class GpuStatServer {
  gpuInfo = null;
  recommendedGpuIndex = -1;
  error = false;

  constructor(opts) {
    makeAutoObservable(this);
    this.name = opts.name;
    this.url = opts.url;
    this.aliases = opts.aliases || [];
    this.type = opts.type || "standard";
    this.filterOutIndexes = Object.assign([], opts.filterOutIndexes);
    this.externalLink = opts.externalLink || null;
    this.externalLinks = opts.externalLinks || [];
  }

  get isAvailable() {
    return this.type === "jetson" || this.hasGpu;
  }

  get hasGpu() {
    return this.gpuInfo && this.gpuInfo.gpus && this.gpuInfo.gpus.length > 0;
  }

  _updateNotError() {
    this.error = false;
  }

  _updateIsError() {
    this.error = true;
  }

  _updateGpuInfo(gpuInfo) {
    this.gpuInfo = gpuInfo;
  }

  _updateRecommendedGpuIndex(recommendedGpuIndex) {
    this.recommendedGpuIndex = recommendedGpuIndex;
  }

  async loadGpuInfo() {
    const gpuInfo = await this.$reqGpuInfo();

    if (gpuInfo) {
      this._updateNotError();

      // Filter out some gpu as defined in config.json
      if (this.filterOutIndexes.length > 0) {
        gpuInfo.gpus = gpuInfo.gpus.filter(
          (value, index) => !this.filterOutIndexes.includes(index)
        );
      }

      this._updateGpuInfo(gpuInfo);

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
          this._updateRecommendedGpuIndex(sortedMemoryGpus[0].index);
        } else {
          this._updateRecommendedGpuIndex(-1);
        }
      }
    } else {
      this._updateIsError();
    }
  }

  $reqGpuInfo() {
    return agent.GpuInfo.get(this.url);
  }
}
