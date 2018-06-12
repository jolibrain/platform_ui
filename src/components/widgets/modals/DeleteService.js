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
    this.serviceNameRef = React.createRef();

    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.props.modalStore.setVisible("deleteService", false);
  }

  handleDeleteService() {
    const ddStore = this.props.deepdetectStore;

    ddStore.deleteService(() => {
      this.props.history.push("/");
    });
  }

  render() {
    const ddStore = this.props.deepdetectStore;

    const server = ddStore.server;

    if (!server) return null;

    const service = ddStore.service;

    if (!service) return null;

    return (
      <div id="modal-deleteService">
        <div className="modal-header">
          <h5 className="modal-title">Are you sure ?</h5>
        </div>

        <div className="modal-body">
          Do you really want to delete service <pre>{service.name}</pre> on
          DeepDetect server <pre>{server.name}</pre> ?
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary mb-2"
            onClick={this.handleCancel}
          >
            No
          </button>
          <button
            type="submit"
            className="btn btn-primary mb-2"
            onClick={this.handleDeleteService}
          >
            Yes
          </button>
        </div>
      </div>
    );
  }
}
