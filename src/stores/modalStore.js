import { observable, action } from "mobx";

export class modalStore {
  @observable
  modals = [
    { name: "stopTraining", visible: false },
    { name: "deleteService", visible: false }
  ];

  @action
  getModal(modalName) {
    return this.modals.find(modal => modal.name === modalName);
  }

  @action
  setVisible(modalName, visible = true) {
    const modal = this.modals.find(modal => modal.name === modalName);
    modal.visible = visible;
  }
}

export default new modalStore();
