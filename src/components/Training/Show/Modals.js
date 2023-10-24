import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import DeleteServiceModal from "../../widgets/modals/DeleteServiceModal";
import StopTrainingModal from "../../widgets/modals/StopTrainingModal";

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
    const deleteServiceModal = modalStore.getModal("deleteService");
    const stopTrainingModal = modalStore.getModal("stopTraining");

    let service = null;
    if (deleteServiceModal.params && deleteServiceModal.params.service) {
      service = deleteServiceModal.params.service;
    }

    return (
      <div>
        <Modal
          visible={stopTrainingModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(this, "stopTraining")}
        >
          <StopTrainingModal redirect="/training" />
        </Modal>
        <Modal
          visible={deleteServiceModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(
            this,
            "deleteService"
          )}
        >
          <DeleteServiceModal service={service} redirect="/training" />
        </Modal>
      </div>
    );
  }
}));
export default Modals;
