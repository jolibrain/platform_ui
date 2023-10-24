import { makeAutoObservable } from "mobx";

export default class datasetStore {
  datasets = [];

  constructor() {
    makeAutoObservable(this);
  }

  setup() {}
}
