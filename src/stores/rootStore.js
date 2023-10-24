import configStore from "./configStore";
import buildInfoStore from "./buildInfoStore";
import gpuStore from "./gpuStore";
import deepdetectStore from "./deepdetectStore";
import imaginateStore from "./imaginateStore";
import modelRepositoriesStore from "./modelRepositoriesStore";
import dataRepositoriesStore from "./dataRepositoriesStore";
import datasetStore from "./datasetStore";
import videoExplorerStore from "./videoExplorerStore";
import modalStore from "./modalStore";
import authTokenStore from "./authTokenStore";
import pathFilterStore from "./pathFilterStore";

class RootStore {
  constructor() {
    this.configStore = new configStore();
    this.buildInfoStore = new buildInfoStore();
    this.gpuStore = new gpuStore();
    this.deepdetectStore = new deepdetectStore();
    this.imaginateStore = new imaginateStore();
    this.modelRepositoriesStore = new modelRepositoriesStore();
    this.dataRepositoriesStore = new dataRepositoriesStore();
    this.datasetStore = new datasetStore();
    this.videoExplorerStore = new videoExplorerStore();
    this.modalStore = new modalStore();
    this.authTokenStore = new authTokenStore();
    this.pathFilterStore = new pathFilterStore();
  }
}

const stores = new RootStore()

export default stores;
