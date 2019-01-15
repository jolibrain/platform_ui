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
      spinner: false,
      service: null
    };
    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let service = null;
    const { server } = nextProps.deepdetectStore;

    if (server && server.service) {
      service = server.service;
    } else {
      service = nextProps.service;
    }

    this.setState({ service: service });
  }

  handleCancel() {
    this.props.modalStore.setVisible("deleteService", false);
  }

  handleDeleteService() {
    const { deepdetectStore, modalStore, history, redirect } = this.props;

    const server = deepdetectStore.servers.find(
      s => s.name === this.state.service.serverName
    );

    if (server) {
      this.setState({ spinner: true });
      server.deleteService(this.state.service.name, () => {
        modalStore.setVisible("deleteService", false);
        history.push(redirect || "/");
      });
    }
  }

  render() {
    if (!this.state.service) return null;

    return (
      <div id="modal-deleteService">
        <div className="modal-header">
          <h5 className="modal-title">Delete Service - Are you sure ?</h5>
        </div>

        <div className="modal-body">
          Do you really want to delete service{" "}
          <pre>{this.state.service.name}</pre> on DeepDetect server{" "}
          <pre>{this.state.service.serverName}</pre> ?
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
