import { observable, action } from "mobx";
import agent from "../agent";

export class GpuStore {
  @observable gpuInfo = null;
  @observable settings = {};

  @observable error = false;

  @action
  setup(configStore) {
    this.settings = configStore.gpuInfo;
  }

  $req() {
    return agent.GpuInfo.get(this.settings);
  }

  @action
  loadGpuInfo() {
    this.$req().then(
      action(gpuInfo => {
        if (typeof gpuinfo === "undefined") {
          this.error = false;
          this.gpuInfo = gpuInfo;
        } else {
          this.error = true;
        }
      })
    );
  }
}

export default new GpuStore();
