import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("modalStore")
@observer
@withRouter
class DeleteRepositoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      service: null,
      deleteError: null
    };
    this.handleDeleteRepository = this.handleDeleteRepository.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ service: nextProps.service });
  }

  handleCancel() {
    this.setState({ deleteError: null });
    this.props.modalStore.setVisible("deleteRepository", false);
  }

  async handleDeleteRepository() {

    const { modalStore, history, redirect } = this.props;
    const { service } = this.state;

    if (service) {
      this.setState({ spinner: true });
      const isDeleted = await service.deleteArchivedJob();

      if(isDeleted) {
        this.setState({ spinner: false });
        modalStore.setVisible("deleteRepository", false);
        history.push(redirect || "/");
      } else {
        this.setState({
          deleteError: "Error deleting archived job, please check writing permissions on filesystem.",
          spinner: false
        });
      }
    }
  }

  render() {
    if (!this.state.service) return null;

    return (
      <div id="modal-deleteRepository">
        <div className="modal-header">
          <h5 className="modal-title">Delete Archived Training Job - Are you sure ?</h5>
        </div>

        <div className="modal-body">
          Do you really want to delete archive training job{" "}
          <pre>{this.state.service.name}</pre> ?

          {this.state.deleteError ? (
            <div className="alert alert-danger" role="alert">
              {this.state.deleteError}
            </div>
          ) : (
            ""
          )}

        </div>

        <div className="modal-footer">
          <button
            id="cancelDeleteRepository"
            className="btn btn-outline-primary mb-2"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            id="submitDeleteRepository"
            type="submit"
            className="btn btn-danger mb-2"
            onClick={this.handleDeleteRepository}
          >
            {this.state.spinner ? (
              <span>
                <i className="fas fa-spinner fa-spin" /> Deleting...
              </span>
            ) : (
              <span>
                <i className="far fa-trash-alt" /> Delete Archived Job
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}
export default DeleteRepositoryModal;
