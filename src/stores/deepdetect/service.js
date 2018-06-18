import { observable } from "mobx";
import autoSave from "../autoSave";

export default class deepdetectService {
  @observable name = "";
  @observable settings = null;
  @observable imgList = [];

  @observable isLoading = false;

  constructor(serverName, opts) {
    this.name = opts.name;
    this.settings = opts;
    autoSave(this, `${serverName}_${this.name}`);
  }
}
