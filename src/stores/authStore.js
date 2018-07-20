import { observable, action } from "mobx";

export class authStore {
  @observable user = null;
}

export default new authStore();
