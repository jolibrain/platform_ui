import { observable, action } from "mobx";

export class authTokenStore {
  @observable token = null;

  @action
  setup() {
    // TODO replace by token fetching method
    this.token = null;
  }
}

export default new authTokenStore();
