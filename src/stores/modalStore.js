import { observable, computed, action } from "mobx";

export class modalStore {
  @observable
  modals = [
    {
      name: "addService",
      visible: false
    },
    {
      name: "publishTraining",
      visible: false
    },
    {
      name: "stopTraining",
      visible: false
    },
    {
      name: "deleteService",
      visible: false
    }
  ];

  @computed
  get visibleModal() {
    return this.modals.find(modal => modal.visible);
  }

  @action
  getModal(modalName) {
    return this.modals.find(modal => modal.name === modalName);
  }

  @action
  setVisible(modalName, visible = true, params = {}) {
    const modal = this.modals.find(modal => modal.name === modalName);
    modal.visible = visible;
    modal.params = params;
  }
}

export default new modalStore();
