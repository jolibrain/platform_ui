import React from "react";

import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import DownloadModelFiles from "../../DownloadModelFiles";

@inject("deepdetectStore")
@withRouter
@observer
export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.serviceNameRef = React.createRef();

    this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);
    this.handleClickCreate = this.handleClickCreate.bind(this);

    this.state = {
      errors: [],
      creatingService: false
    };
  }

  validateBeforeSubmit() {
    let errors = [];

    let serviceName = this.serviceNameRef.current.value;

    if (serviceName.length === 0) serviceName = this.props.repository.label;

    if (serviceName.length === 0) {
      errors.push("Service name can't be empty");
    }

    if (serviceName === "new") {
      errors.push("Service name can't be named 'new'");
    }
    const ddStore = this.props.deepdetectStore;
    const serviceNames = ddStore.server.services.map(s => s.name.toLowerCase());

    if (serviceNames.includes(serviceName.toLowerCase())) {
      errors.push("Service name already exists");
    }

    this.setState({ errors: errors });

    return errors.length === 0;
  }

  handleClickCreate() {
    const { repository } = this.props;

    if (!repository.jsonConfig) {
      this.props.history.push({
        pathname: "/predict/new",
        state: { repository: repository }
      });
      return null;
    }

    if (!this.validateBeforeSubmit()) {
      return null;
    }

    let serviceName = this.serviceNameRef.current.value;

    if (serviceName.length === 0) serviceName = repository.label;

    serviceName = serviceName.toLowerCase();

    const ddStore = this.props.deepdetectStore;

    this.setState({ creatingService: true });

    let serviceData = repository.jsonConfig;

    if (serviceData.parameters.output) {
      serviceData.parameters.output.store_config = false;
    } else {
      serviceData.parameters.output = { store_config: false };
    }

    // db input parameter must always be false.
    // https://gitlab.com/jolibrain/core-ui/issues/318
    // https://gitlab.com/jolibrain/core-ui/issues/280
    if (serviceData.parameters.input && serviceData.parameters.input.db) {
      serviceData.parameters.input.db = false;
    }

    ddStore.newService(serviceName, serviceData, (resp, err) => {
      if (typeof err !== "undefined") {
        const message =
          typeof err.status !== "undefined"
            ? `${err.status.msg}: ${err.status.dd_msg}`
            : "Error while creating service";

        this.setState({
          creatingService: false,
          errors: [message]
        });
      } else {
        this.setState({
          creatingService: false,
          errors: []
        });

        ddStore.setService(serviceName);

        const serviceUrl = `/predict/${
          ddStore.hostableServer.name
        }/${serviceName}`;
        this.props.history.push(serviceUrl);
      }
    });
  }

  render() {
    const { repository } = this.props;

    if (!repository) return null;

    let modelValues = null;
    if (repository.bestModel) {
      modelValues = (
        <div className="content row pt-2 pl-2">
          {Object.keys(repository.bestModel).map((k, i) => {
            let attrTitle =
              i === 0
                ? k.replace(/\b\w/g, l => l.toUpperCase())
                : k.toUpperCase();

            if (attrTitle === "MEANIOU") attrTitle = "Mean IOU";

            return (
              <div key={i} className="col-6">
                <h3>{repository.bestModel[k]}</h3>
                <h4>{attrTitle}</h4>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="col-lg-4 col-md-12 my-2">
        <div className="card">
          <div
            className={
              modelValues !== null ? "card-body hasBestModel" : "card-body"
            }
          >
            <h5 className="card-title">
              <span className="title">
                <i className="fas fa-archive" /> {repository.name}
              </span>
            </h5>

            <h6 className="card-subtitle mb-2 text-muted">
              {repository.jsonConfig &&
              repository.jsonConfig.description &&
              repository.jsonConfig.description.length > 0
                ? repository.jsonConfig.description
                : " "}
            </h6>

            <div className="row process-icons">
              <div className="col-12">
                <i className={`fas fa-tag ${repository.store.name}`} />{" "}
                {repository.trainingTags.join(", ")}
              </div>
              {repository.metricsDate ? (
                <div className="col-12">
                  <i className="far fa-clock" />{" "}
                  {moment(repository.metricsDate).format("L LT")}
                </div>
              ) : (
                ""
              )}
              <div className="col-12">
                <i className="fas fa-folder" /> {repository.path}
              </div>
            </div>

            {this.state.errors.length > 0 ? (
              <div className="alert alert-danger" role="alert">
                <b>
                  <i className="fas fa-exclamation-circle" /> Error while
                  creating service
                </b>
                <ul>
                  {this.state.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <DownloadModelFiles repository={repository} hidePath />
            )}
            {modelValues}
          </div>

          <div className="card-footer">
            <div id="create-service" className="input-group">
              <input
                type="text"
                className="form-control"
                id="inlineFormInputName"
                defaultValue={repository.name}
                ref={this.serviceNameRef}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  onClick={this.handleClickCreate.bind(this, repository.name)}
                >
                  <i
                    className={
                      this.state.creatingService
                        ? "fas fa-spinner fa-spin"
                        : "fas fa-plus"
                    }
                  />&nbsp; Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  repository: PropTypes.object.isRequired
};
