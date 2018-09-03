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
    const { deepdetectStore, modalStore, history } = this.props;
    this.setState({ spinner: true });
    deepdetectStore.deleteService(() => {
      modalStore.setVisible("deleteService", false);
      history.push("/");
    });
  }

  render() {
    const { server } = this.props.deepdetectStore;

    if (!server || !server.service) return null;

    return (
      <div id="modal-deleteService">
        <div className="modal-header">
          <h5 className="modal-title">Are you sure ?</h5>
        </div>

        <div className="modal-body">
          Do you really want to delete service <pre>{server.service.name}</pre>{" "}
          on DeepDetect server <pre>{server.name}</pre> ?
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
            {this.state.spinner ? <i className="fas fa-spinner fa-spin" /> : ""}
            Yes
          </button>
        </div>
      </div>
    );
  }
}
