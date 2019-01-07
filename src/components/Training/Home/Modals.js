import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import PublishTrainingModal from "../../widgets/modals/PublishTrainingModal";

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

    const publishTrainingModal = modalStore.getModal("publishTraining");

    let service = null;
    if (publishTrainingModal.params && publishTrainingModal.params.service) {
      service = publishTrainingModal.params.service;
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
      </div>
    );
  }
}
