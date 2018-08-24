import { observable, action, reaction } from "mobx";

class CommonStore {
  @observable appName = "DeepDetect";
  @observable appLoaded = false;

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }
}

export default new CommonStore();
