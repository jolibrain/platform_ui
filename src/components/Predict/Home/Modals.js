import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import BenchmarkDisplayModal from "../../widgets/modals/BenchmarkDisplayModal";
import DeleteServiceModal from "../../widgets/modals/DeleteServiceModal";
import PredictAddServiceModal from "../../widgets/modals/PredictAddServiceModal";

import stores from "../../../stores/rootStore";

const Modals = withRouter(observer(class Modals extends React.Component {
  constructor(props) {
    super(props);

    this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
  }

  modalBackdropClicked(modalName) {
    const { modalStore } = stores;
    modalStore.setVisible(modalName, false);
  }

  render() {
    const { modalStore } = stores;

    const benchmarkDisplayModal = modalStore.getModal("benchmarkDisplay");
    const addServiceModal = modalStore.getModal("addService");
    const deleteServiceModal = modalStore.getModal("deleteService");

    let repository = null;
    let service = null;

    if (
      benchmarkDisplayModal.params &&
      benchmarkDisplayModal.params.repository
    ) {
      repository = benchmarkDisplayModal.params.repository;
    }

    if (addServiceModal.params && addServiceModal.params.repository) {
      repository = addServiceModal.params.repository;
    }

    if (deleteServiceModal.params && deleteServiceModal.params.service) {
      service = deleteServiceModal.params.service;
    }

    return (
      <div>
        <Modal
          visible={benchmarkDisplayModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(
            this,
            "benchmarkDisplay"
          )}
        >
          <BenchmarkDisplayModal repository={repository} />
        </Modal>
        <Modal
          visible={addServiceModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(this, "addService")}
        >
          <PredictAddServiceModal repository={repository} redirect="/predict" />
        </Modal>
        <Modal
          visible={deleteServiceModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(
            this,
            "deleteService"
          )}
        >
          <DeleteServiceModal service={service} redirect="/predict" />
        </Modal>
      </div>
    );
  }
}));
export default Modals;
