import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap4-modal";

import PublishTrainingModal from "../../../../widgets/modals/PublishTrainingModal";

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
        const {service, modalStore} = this.props;
        const publishTrainingModal = modalStore.getModal("publishTraining");

        return (
            <div>
              <Modal
                visible={publishTrainingModal.visible}
                onClickBackdrop={this.modalBackdropClicked.bind(this, "publishTraining")}
              >
                <PublishTrainingModal service={service} />
              </Modal>
            </div>
        );
    }
}
export default Modals;
