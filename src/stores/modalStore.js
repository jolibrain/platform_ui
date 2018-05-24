import { observable, action } from 'mobx';

export class modalStore {

  @observable modals = [];

  @action setup(configStore) {
    this.modals = configStore.modals.map( modal => {
      return {name: modal, visible: false};
    });
  }

  @action addModal(modalName) {
    this.modals.push({name: modalName, visible: false});
  }

  @action getModal(modalName) {
    return this.modals.find(modal => modal.name === modalName);
  }

  @action setVisible(modalName, visible = true) {
    this.modals.find(modal => modal.name === modalName).visible = visible;
  }
}

export default new modalStore();
