import { observable } from "mobx";

export default class Input {
  @observable content = {};
  @observable postData = {};
  @observable path = null;
  @observable json = null;
  @observable error = false;
  @observable boxes = [];
}
