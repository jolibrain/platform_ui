import { observable, action } from "mobx";
import autoSave from "./autoSave";
import store from "store";

export class authStore {
  @observable user = null;

  constructor(opts) {
    autoSave(this, `autosave_auth`);
  }

  @action
  removeStore() {
    store.remove(`autosave_auth`);
  }
}

export default new authStore();
