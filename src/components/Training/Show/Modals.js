import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import StopTrainingModal from "../../widgets/modals/StopTrainingModal";

@inject("modalStore")
@withRouter
@observer
export default class Modals extends React.Component {
  constructor(props) {
    super(props);

    this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
  }

  modalBackdropClicked(modalName) {
    const store = this.props.modalStore;
    store.setVisible(modalName, false);
  }

  render() {
    const store = this.props.modalStore;
    const modal = store.getModal("stopTraining");

    if (!modal.visible) return null;

    return (
      <Modal
        visible={modal.visible}
        onClickBackdrop={this.modalBackdropClicked.bind(this, "stopTraining")}
      >
        <StopTrainingModal />
      </Modal>
    );
  }
}
