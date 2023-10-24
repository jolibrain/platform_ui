import { makeAutoObservable } from "mobx";

export default class authTokenStore {
  token = null;

  constructor() {
    makeAutoObservable(this);
  }

  setup() {
    // TODO replace by token fetching method
    this.token = null;
  }
}
