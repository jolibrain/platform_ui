import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import stores from "../../../stores/rootStore";

const StopTrainingModal = withRouter(observer(class StopTrainingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false
    };
    this.handleStopTraining = this.handleStopTraining.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    const { modalStore } = stores;
    modalStore.setVisible("stopTraining", false);
  }

  handleStopTraining() {
    const { deepdetectStore, modalStore } = stores;
    const { history } = this.props;
    this.setState({ spinner: true });
    deepdetectStore.stopTraining(() => {
      modalStore.setVisible("stopTraining", false);
      history.push("/training");
    });
  }

  render() {
    const { deepdetectStore } = stores;
    const { server } = deepdetectStore;

    if (!server || !server.service) return null;

    return (
      <div id="modal-stopTraining">
        <div className="modal-header">
          <h5 className="modal-title">Stop Training - Are you sure ?</h5>
        </div>

        <div className="modal-body">
          Do you really want to stop training service{" "}
          <pre>{server.service.name}</pre> on DeepDetect server{" "}
          <pre>{server.name}</pre> ?
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-outline-primary mb-2"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary mb-2"
            onClick={this.handleStopTraining}
          >
            {this.state.spinner ? (
              <span>
                <i className="fas fa-spinner fa-spin" /> Stopping...
              </span>
            ) : (
              <span>
                <i className="far fa-hand-paper" /> Stop Training
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}));
export default StopTrainingModal;
