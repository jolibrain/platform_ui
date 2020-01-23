import { observable, action } from "mobx";

export class datasetStore {
  @observable datasets = [];

  @action
  setup() {}
}

export default new datasetStore();
