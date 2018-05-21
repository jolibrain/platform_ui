import { observable, action } from 'mobx';
import agent from '../agent';

export class GpuStore {

  @observable gpuInfo = null;
  @observable settings = {};

  @action setup(configStore) {
    this.settings = configStore.gpuInfo;
  }

  $req() {
    return agent.GpuInfo.get(this.settings);
  }

  @action loadGpuInfo() {
    this.$req()
      .then(action( gpuInfo => {
        this.gpuInfo = gpuInfo;
      }));
  }
}

export default new GpuStore();
