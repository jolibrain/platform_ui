import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import DeleteServiceModal from "../../widgets/modals/DeleteServiceModal";
import PredictAddServiceModal from "../../widgets/modals/PredictAddServiceModal";

@inject("modalStore")
@withRouter
@observer
export default class Modals extends React.Component {
  constructor(props) {
    super(props);

    this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
  }

  modalBackdropClicked(modalName) {
    this.props.modalStore.setVisible(modalName, false);
  }

  render() {
    const modalStore = this.props.modalStore;

    const addServiceModal = modalStore.getModal("addService");
    const deleteServiceModal = modalStore.getModal("deleteService");

    let repository = null;
    let service = null;

    if (addServiceModal.params && addServiceModal.params.repository) {
      repository = addServiceModal.params.repository;
    }

    if (deleteServiceModal.params && deleteServiceModal.params.service) {
      service = deleteServiceModal.params.service;
    }

    return (
      <div>
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
}
