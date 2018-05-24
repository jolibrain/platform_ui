import { observable, action } from 'mobx';
import agent from '../agent';

export class configStore {

  @observable configLoaded = false;

  @observable deepdetect = {
    host: 'localhost',
    port: 3000,
    path: '/api',
  };

  @observable gpuInfo = {
    refreshRate: 5000,
  };

  @observable imaginate = {
    initImages: []
  };

  @observable modals = [];

  $req(path) {
    return agent.Config.get();
  }

  @action loadConfig(callback = () => {}) {
    this.$req()
      .then(action( config => {
        this.configLoaded = true;
        this.gpuInfo = config.gpuInfo;
        this.deepdetect = config.deepdetect;
        this.imaginate = config.imaginate;
        this.modals = config.modals;
        callback();
      }));
  }
}

export default new configStore();
