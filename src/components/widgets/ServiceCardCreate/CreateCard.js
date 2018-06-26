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
    if (!this.validateBeforeSubmit()) {
      return null;
    }

    const repository = this.props.repository;

    let serviceName = this.serviceNameRef.current.value;

    if (serviceName.length === 0) serviceName = repository.label;

    const serviceData = JSON.parse(repository.jsonConfig);
    const ddStore = this.props.deepdetectStore;

    this.setState({ creatingService: true });

    ddStore.newService(serviceName, serviceData, resp => {
      if (resp instanceof Error || resp.status.code === 500) {
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

        this.props.history.push(`/predict/private/${serviceName}`);
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
          <h5 className="card-title">{name}</h5>
          <input
            type="text"
            className="form-control mb-2"
            id="inlineFormInputName"
            placeholder={`default name: ${name}`}
            ref={this.serviceNameRef}
          />
          <button
            className="btn btn-outline-primary"
            onClick={this.handleClickCreate.bind(this, name)}
          >
            <i
              className="fas fa-spinner fa-spin"
              style={this.state.creatingService ? {} : { display: "none" }}
            />&nbsp; Add Service
          </button>
        </div>
      </div>
    );
  }
}
