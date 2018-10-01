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

    ddStore.newService(serviceName, serviceData, resp => {
      if (resp instanceof Error || resp.status.code !== 201) {
        this.setState({
          creatingService: false,
          errors: [resp.message || resp.status.msg]
        });
      } else {
        this.setState({
          creatingService: false,
          errors: []
        });

        ddStore.setService(serviceName);

        this.props.history.push(
          `/predict/${ddStore.writableServer.name}/${serviceName}`
        );
      }
    });
  }

  render() {
    const { repository } = this.props;

    if (!repository) return null;

    let badges = [];

    switch (repository.store.name) {
      case "public":
        badges.push({
          classNames: "badge badge-primary",
          status: repository.store.name
        });
        break;
      default:
        badges.push({
          classNames: "badge badge-warning",
          status: repository.store.name
        });
        break;
    }

    let tags = repository.trainingTags;
    if (tags && tags.length > 0) {
      tags.filter(t => t !== "private" && t !== "public").forEach(t =>
        badges.push({
          classNames: "badge badge-info",
          status: t
        })
      );
    }

    if (repository.metricsDate) {
      badges.push({
        classNames: "badge badge-light",
        status: moment(repository.metricsDate).format("L LT")
      });
    }

    return (
      <div className="card">
        <div className="card-header">
          {badges.map((badge, key) => (
            <span key={key} className={badge.classNames}>
              {badge.status}
            </span>
          ))}
        </div>

        <div className="card-body">
          <h5 className="card-title">{repository.name}</h5>

          {repository.jsonConfig &&
          repository.jsonConfig.description &&
          repository.jsonConfig.description.length > 0 ? (
            <h6 className="card-subtitle mb-2 text-muted">
              {repository.jsonConfig.description}
            </h6>
          ) : (
            ""
          )}

          <DownloadModelFiles repository={repository} />

          <div
            className="alert alert-danger"
            role="alert"
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              display: this.state.errors.length > 0 ? "" : "none"
            }}
          >
            <b>Error while creating service</b>
            <ul>
              {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </div>

          <div id="create-service" className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="inlineFormInputName"
              defaultValue={repository.name}
              ref={this.serviceNameRef}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
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
    );
  }
}

Card.propTypes = {
  repository: PropTypes.object.isRequired
};
