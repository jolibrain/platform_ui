import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import PublishTrainingModal from "../../widgets/modals/PublishTrainingModal";
import DeleteServiceModal from "../../widgets/modals/DeleteServiceModal";
import DeleteRepositoryModal from "../../widgets/modals/DeleteRepositoryModal";

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

    const publishTrainingModal = modalStore.getModal("publishTraining");
    const deleteServiceModal = modalStore.getModal("deleteService");
    const deleteRepositoryModal = modalStore.getModal("deleteRepository");

    let service = null;

    if (publishTrainingModal.params && publishTrainingModal.params.service) {
      service = publishTrainingModal.params.service;
    }

    if (deleteServiceModal.params && deleteServiceModal.params.service) {
      service = deleteServiceModal.params.service;
    }

    if (deleteRepositoryModal.params && deleteRepositoryModal.params.service) {
      service = deleteRepositoryModal.params.service;
    }

    return (
      <div>
        <Modal
          visible={publishTrainingModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(
            this,
            "publishTraining"
          )}
        >
          <PublishTrainingModal service={service} redirect="/training" />
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
        <Modal
          visible={deleteRepositoryModal.visible}
          onClickBackdrop={this.modalBackdropClicked.bind(
            this,
            "deleteRepository"
          )}
        >
          <DeleteRepositoryModal service={service} redirect="/training" />
        </Modal>
      </div>
    );
  }
}));
export default Modals;
