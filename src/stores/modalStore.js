import { makeAutoObservable } from "mobx";

export default class modalStore {
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
    },
    {
      name: "deleteRepository",
      visible: false
    },
    {
      name: "benchmarkDisplay",
      visible: false
    }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  get visibleModal() {
    return this.modals.find(modal => modal.visible);
  }

  getModal(modalName) {
    return this.modals.find(modal => modal.name === modalName);
  }

  setVisible(modalName, visible = true, params = {}) {
    const modal = this.modals.find(modal => modal.name === modalName);
    modal.visible = visible;
    modal.params = params;
  }
}
