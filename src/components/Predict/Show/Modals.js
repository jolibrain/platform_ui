import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import DeleteServiceModal from "../../widgets/modals/DeleteServiceModal";

@inject("modalStore")
@withRouter
@observer
class Modals extends React.Component {
  constructor(props) {
    super(props);

    this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
  }

  modalBackdropClicked(modalName) {
    this.props.modalStore.setVisible(modalName, false);
  }

  render() {
    const store = this.props.modalStore;
    const deleteServiceModal = store.getModal("deleteService");

    let service = null;
    if (deleteServiceModal.params && deleteServiceModal.params.service) {
      service = deleteServiceModal.params.service;
    }

    return (
      <Modal
        visible={deleteServiceModal.visible}
        onClickBackdrop={this.modalBackdropClicked.bind(this, "deleteService")}
      >
        <DeleteServiceModal service={service} redirect="/predict" />
      </Modal>
    );
  }
}
export default Modals;
