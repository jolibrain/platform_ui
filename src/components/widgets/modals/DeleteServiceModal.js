import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("modalStore")
@observer
@withRouter
export default class DeleteServiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false
    };
    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.props.modalStore.setVisible("deleteService", false);
  }

  handleDeleteService() {
    const { deepdetectStore, modalStore, history, redirect } = this.props;
    this.setState({ spinner: true });
    deepdetectStore.deleteService(() => {
      modalStore.setVisible("deleteService", false);
      history.push(redirect || "/");
    });
  }

  render() {
    const { server } = this.props.deepdetectStore;

    if (!server || !server.service) return null;

    return (
      <div id="modal-deleteService">
        <div className="modal-header">
          <h5 className="modal-title">Delete Service - Are you sure ?</h5>
        </div>

        <div className="modal-body">
          Do you really want to delete service <pre>{server.service.name}</pre>{" "}
          on DeepDetect server <pre>{server.name}</pre> ?
        </div>

        <div className="modal-footer">
          <button
            id="cancelDeleteService"
            className="btn btn-outline-primary mb-2"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            id="submitDeleteService"
            type="submit"
            className="btn btn-primary mb-2"
            onClick={this.handleDeleteService}
          >
            {this.state.spinner ? (
              <span>
                <i className="fas fa-spinner fa-spin" /> Deleting...
              </span>
            ) : (
              <span>
                <i className="far fa-trash-alt" /> Delete Service
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}
