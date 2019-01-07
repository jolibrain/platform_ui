import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@inject("modalStore")
@observer
@withRouter
export default class PublishTrainingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      serviceName: "",
      targetRepository: ""
    };

    this.handlePublishTraining = this.handlePublishTraining.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.handleServiceNameChange = this.handleServiceNameChange.bind(this);
    this.handleTargetRepositoryChange = this.handleTargetRepositoryChange.bind(
      this
    );
  }

  componentWillReceiveProps(nextProps) {
    const { modelRepositoriesStore, service } = nextProps;

    if (!service) return null;

    const { repositoryStores } = modelRepositoriesStore;
    const privateStore = repositoryStores.find(r => r.name === "private");

    this.setState({
      serviceName: service.name,
      targetRepository:
        privateStore.systemPath + privateStore.nginxPath + service.name,
      publishError: null
    });
  }

  handleServiceNameChange(event) {
    this.setState({ serviceName: event.target.value });
  }

  handleTargetRepositoryChange(event) {
    this.setState({ targetRepository: event.target.value });
  }

  handleCancel() {
    this.setState({ publishError: null });
    this.props.modalStore.setVisible("publishTraining", false);
  }

  handlePublishTraining() {
    const {
      deepdetectStore,
      modelRepositoriesStore,
      modalStore,
      history
    } = this.props;
    const { serviceName, targetRepository } = this.state;

    if (serviceName.length === 0) {
      this.setState({
        spinner: false,
        publishError: "Service name can't be empty"
      });
      return null;
    }

    if (targetRepository.length === 0) {
      this.setState({
        spinner: false,
        publishError: "Target repository can't be empty"
      });
      return null;
    }

    const { repositoryStores } = modelRepositoriesStore;
    const privateStore = repositoryStores.find(r => r.name === "private");
    const targetPrefix = privateStore.systemPath + privateStore.nginxPath;

    if (!targetRepository.startswith(targetPrefix)) {
      this.setState({
        spinner: false,
        publishError: `Target repository must start with prefix ${targetPrefix}`
      });
      return null;
    }

    this.setState({ spinner: true, publishError: null });

    const service = this.props.service;

    let serviceConfig = service.jsonConfig;

    serviceConfig.model.repository = targetRepository;
    serviceConfig.model.create_repository = true;

    serviceConfig.parameters.output.store_config = true;
    serviceConfig.parameters.mllib.from_repository = service.location;
    delete serviceConfig.parameters.mllib.template;

    const ddServer = deepdetectStore.hostableServer;
    const existingServices = ddServer.services.map(s => s.name.toLowerCase());
    if (existingServices.includes(serviceName.toLowerCase())) {
      this.setState({
        spinner: false,
        publishError: "Service name already exists"
      });
    } else {
      ddServer.newService(serviceName, serviceConfig, async (response, err) => {
        if (err) {
          this.setState({
            spinner: false,
            publishError: `${err.status.msg}: ${err.status.dd_msg}`
          });
        } else {
          // TODO add serviceName in ddServer.deleteService method
          // to avoid using private request method
          await ddServer.$reqDeleteService(service.name);
          modelRepositoriesStore.refresh();
          modalStore.setVisible("publishTraining", false);
          history.push(`/predict`);
          // TODO allow to direct link to predict page of newly created service
          //history.push(`/predict/private/${serviceName}`);
        }
      });
    }
  }

  render() {
    return (
      <div id="modal-publishTraining">
        <div className="modal-header">
          <h5 className="modal-title">Publish Training</h5>
        </div>

        <div className="modal-body">
          <form>
            <div class="form-group">
              <label for="serviceName">Service Name</label>
              <input
                type="text"
                class="form-control"
                id="serviceName"
                aria-describedby="serviceNameHelp"
                placeholder="Enter service name"
                value={this.state.serviceName}
                onChange={this.handleServiceNameChange}
              />
              <small id="serviceNameHelp" class="form-text text-muted">
                name of the Predict service, it must be unique.
              </small>
            </div>
            <div class="form-group">
              <label for="targetRepository">Target repository</label>
              <input
                type="text"
                class="form-control"
                id="targetRepository"
                aria-describedby="targetRepositoryHelp"
                placeholder="Target repository"
                value={this.state.targetRepository}
                onChange={this.handleTargetRepositoryChange}
              />
              <small id="targetRepositoryHelp" class="form-text text-muted">
                system path where the Predict service will store its model
              </small>
            </div>
          </form>

          {this.state.publishError ? (
            <div className="alert alert-danger" role="alert">
              <p>
                <b>Error while publishing service</b>
              </p>
              <p>{this.state.publishError}</p>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary mb-2"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary mb-2"
            onClick={this.handlePublishTraining}
          >
            {this.state.spinner ? (
              <span>
                <i className="fas fa-spinner fa-spin" /> Publishing...
              </span>
            ) : (
              <span>
                <i className="fas fa-plus" /> Publish
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}
