import { observable } from "mobx";
import store from "store";
import autoSave from "../autoSave";

export default class deepdetectService {
  @observable name = "";
  @observable inputs = [];
  @observable settings = null;
  @observable serverName = "";

  @observable isLoading = false;

  constructor(serverName, opts) {
    this.name = opts.name;
    this.settings = opts;
    this.serverName = serverName;
    autoSave(this, `${serverName}_${this.name}`);
  }

  removeStore() {
    store.remove(`${this.serverName}_${this.name}`);
  }
}
