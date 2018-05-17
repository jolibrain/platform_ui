import { observable, action } from 'mobx';
import agent from '../agent';

export class GpuStore {

  @observable gpuInfo = null;

  $req() {
    return agent.GpuInfo.get();
  }

  @action loadGpuInfo() {
    this.$req()
      .then(action( gpuInfo => {
        this.gpuInfo = gpuInfo;
      }));
  }
}

export default new GpuStore();
