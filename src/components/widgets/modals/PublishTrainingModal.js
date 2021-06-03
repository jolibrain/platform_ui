import React from "react";
import { withRouter, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@inject("modalStore")
@observer
@withRouter
class PublishTrainingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      serviceName: "",
      targetRepository: "",
      deleteAfterPublish: true
    };

    this.renderPublishMessage = this.renderPublishMessage.bind(this);

    this.handlePublishTraining = this.handlePublishTraining.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.handleServiceNameChange = this.handleServiceNameChange.bind(this);
    this.handleTargetRepositoryChange = this.handleTargetRepositoryChange.bind(
      this
    );
    this.handleToggleDeleteAfterPublish = this.handleToggleDeleteAfterPublish.bind(
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
      publishMessage: null
    });
  }

  handleToggleDeleteAfterPublish(event) {
    this.setState({ deleteAfterPublish: !event.target.value });
  }

  handleServiceNameChange(event) {
    this.setState({ serviceName: event.target.value });
  }

  handleTargetRepositoryChange(event) {
    this.setState({ targetRepository: event.target.value });
  }

  handleCancel() {
    this.setState({ publishMessage: null });
    this.props.modalStore.setVisible("publishTraining", false);
  }

  handlePublishTraining() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;
    const { serviceName, targetRepository } = this.state;

    if (serviceName.length === 0) {
      this.setState({
        spinner: false,
        publishMessage: {
          isError: true,
          content: "Service name can't be empty"
        }
      });
      return null;
    }

    if (targetRepository.length === 0) {
      this.setState({
        spinner: false,
        publishMessage: {
          isError: true,
          content: "Target repository can't be empty"
        }
      });
      return null;
    }

    const { repositoryStores } = modelRepositoriesStore;
    const privateStore = repositoryStores.find(r => r.name === "private");
    const targetPrefix = privateStore.systemPath + privateStore.nginxPath;

    if (!targetRepository.startsWith(targetPrefix)) {
      this.setState({
        spinner: false,
        publishMessage: {
          isError: true,
          content: `Target repository must start with prefix ${targetPrefix}`
        }
      });
      return null;
    }

    this.setState({ spinner: true, publishMessage: null });

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
        publishMessage: {
          isError: true,
          content: "Service name already exists"
        }
      });
    } else {
      ddServer.newService(serviceName, serviceConfig, async (response, err) => {
        if (err) {
          if (err.status) {
            this.setState({
              spinner: false,
              publishMessage: {
                isError: true,
                content: `${err.status.msg}: ${err.status.dd_msg}`
              }
            });
          } else if (err.message){
            this.setState({
              spinner: false,
              publishMessage: {
                isError: true,
                content: `Error publishing model: ${err.message}`
              }
            });
          } else {
            this.setState({
              spinner: false,
              publishMessage: {
                isError: true,
                content: `Error publishing model.`
              }
            });
          }
        } else {

          if(
            response &&
              response.status &&
              response.status.code &&
              response.status.code !== 200
            ) {

            this.setState({
              spinner: false,
              publishMessage: {
                isError: true,
                content: `${response.status.msg}: ${response.status.dd_msg}`
              }
            });

          } else {

            modelRepositoriesStore.refresh();
            if (this.state.deleteAfterPublish) {
              // TODO add serviceName in ddServer.deleteService method
              // to avoid using private request method
              await ddServer.$reqDeleteService(serviceName);

              this.setState({
                spinner: false,
                publishMessage: {
                  isError: false,
                  content: `Service is now available on Predict page.`
                }
              });
            } else {
              this.setState({
                spinner: false,
                publishMessage: {
                  isError: false,
                  content: `Service has been published.`,
                  serviceName: serviceName
                }
              });
            }

          }

        }
      });
    }
  }

  renderPublishMessage() {
    const { publishMessage } = this.state;
    let message = "";

    if (publishMessage) {
      if (publishMessage.isError) {
        message = (
          <div className="alert alert-danger" role="alert">
            <p>
              <b>Error while publishing service</b>
            </p>
            <p>{publishMessage.content}</p>
          </div>
        );
      } else {
        message = (
          <div className="alert alert-success" role="alert">
            <p>
              <b>Success!</b>
            </p>
            <p>{publishMessage.content}</p>
            <p>
              {publishMessage.serviceName ? (
                <Link to={`/predict/private/${publishMessage.serviceName}`}>
                  Open <b>{publishMessage.serviceName}</b> service
                </Link>
              ) : (
                <Link to={`/predict`}>View available Predict services</Link>
              )}
            </p>
          </div>
        );
      }
    }

    return message;
  }

  render() {
    const { publishMessage } = this.state;
    return (
      <div id="modal-publishTraining">
        <div className="modal-header">
          <h5 className="modal-title">Publish Training</h5>
        </div>

        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="serviceName">Service Name</label>
              <input
                type="text"
                className="form-control"
                id="serviceName"
                aria-describedby="serviceNameHelp"
                placeholder="Enter service name"
                value={this.state.serviceName}
                onChange={this.handleServiceNameChange}
              />
              <small id="serviceNameHelp" className="form-text text-muted">
                name of the Predict service, it must be unique.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="targetRepository">Target repository</label>
              <input
                type="text"
                className="form-control"
                id="targetRepository"
                aria-describedby="targetRepositoryHelp"
                placeholder="Target repository"
                value={this.state.targetRepository}
                onChange={this.handleTargetRepositoryChange}
              />
              <small id="targetRepositoryHelp" className="form-text text-muted">
                system path where the Predict service will store its model
              </small>
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                defaultChecked={this.state.deleteAfterPublish}
                onChange={this.handleToggleDeleteAfterPublish}
              />{" "}
              Delete service after publishing
              <small
                id="deleteAfterPublishHelp"
                className="form-text text-muted"
              >
                If checked, service will be deleted after it's been published as
                an available Predict service
              </small>
            </div>
          </form>

          {this.renderPublishMessage()}
        </div>

        <div className="modal-footer">

          { publishMessage && !publishMessage.isError ?

            <button
              className="btn btn-primary mb-2"
              onClick={this.handleCancel}
              key="closeFooterButton"
            >
              Close
            </button>

            :

            <span key="publishFooter">
              <button
                className="btn btn-outline-primary mb-2"
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
            </span>

          }
        </div>
      </div>
    );
  }
}
export default PublishTrainingModal;
