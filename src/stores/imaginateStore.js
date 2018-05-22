import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class imaginateStore {

  @observable settings = {};

  @observable imgList = [];
  @observable selectedIndex = 0;

  @action setup(configStore) {
    this.settings = configStore.imaginate;
    this.imgList = this.settings.initImages;
  }

  @action changeSelectedIndex(index) {
    this.selectedIndex = index;
  }

}

export default new imaginateStore();
