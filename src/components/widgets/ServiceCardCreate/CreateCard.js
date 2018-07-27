import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class CreateCard extends React.Component {
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
    const repository = this.props.repository;

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

    const serviceData = repository.jsonConfig;
    const ddStore = this.props.deepdetectStore;

    this.setState({ creatingService: true });

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
    const repository = this.props.repository;

    if (!repository || repository.length === 0) return null;

    const isPublic = repository.label.indexOf("/public/") !== -1;
    const name = repository.label
      .slice(0, -1)
      .split("/")
      .pop();

    let downloableFiles = [];
    if (!isPublic) {
      downloableFiles = repository.files.map((f, index) => {
        return (
          <a
            key={index}
            href={f.url}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            download
          >
            {f.filename}
            <i className="fas fa-download" />
          </a>
        );
      });
    }

    let badgeClasses = "badge float-right";
    let badgeText = "Public";
    if (isPublic) {
      badgeClasses += " badge-primary";
    } else {
      badgeClasses += " badge-warning";
      badgeText = "Private";
    }

    return (
      <div className="card">
        <div className="card-body">
          <span className={badgeClasses}>{badgeText}</span>
          <div className="row">
            <input
              type="text"
              className="form-control mb-2"
              id="inlineFormInputName"
              defaultValue={name}
              ref={this.serviceNameRef}
            />

            {repository.jsonConfig &&
            repository.jsonConfig.description &&
            repository.jsonConfig.description.length > 0 ? (
              <p style={{ width: "100%" }}>
                {repository.jsonConfig.description}
              </p>
            ) : (
              ""
            )}

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

            <button
              className="btn btn-outline-primary"
              onClick={this.handleClickCreate.bind(this, name)}
              style={{
                marginBottom: "10px"
              }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={this.state.creatingService ? {} : { display: "none" }}
              />&nbsp; Add Service
            </button>
          </div>

          {downloableFiles.length > 0 ? (
            <div className="row">
              <div className="list-group">{downloableFiles}</div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
