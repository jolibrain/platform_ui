import { observable } from "mobx";
import store from "store";
import autoSave from "../autoSave";

export default class deepdetectService {
  @observable serverName = "";
  @observable name = "";
  @observable settings = null;
  @observable imgList = [];

  @observable isLoading = false;

  constructor(serverName, opts) {
    this.serverName = serverName;
    this.name = opts.name;
    this.settings = opts;
    autoSave(this, `${serverName}_${this.name}`);
  }

  removeStore() {
    store.remove(`${this.serverName}_${this.name}`);
  }
}
