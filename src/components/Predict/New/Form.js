import React from "react";
import { withRouter } from "react-router-dom";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import copy from "copy-to-clipboard";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

@inject("imaginateStore")
@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@observer
@withRouter
export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);
    this.submitService = this.submitService.bind(this);

    this.handleInputServiceNameChange = this.handleInputServiceNameChange.bind(
      this
    );
    this.handleInputDescriptionChange = this.handleInputDescriptionChange.bind(
      this
    );
    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleCurlChange = this.handleCurlChange.bind(this);

    const ddStore = this.props.deepdetectStore;

    let defaultConfig = ddStore.settings.services.defaultConfig.find(config => {
      return config.modelName === "default";
    });

    this.state = {
      creatingService: false,
      serviceName: "",
      description: "",
      defaultConfig: defaultConfig,
      jsonConfig: JSON.stringify(defaultConfig.modelConfig, null, 1),
      copied: false,
      errors: [],
      selectedLocation: []
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
  }

  componentWillMount() {
    if (this.props.location.state && this.props.location.state.repository) {
      const repository = this.props.modelRepositoriesStore.repositories.find(
        r => r.modelName === this.props.location.state.repository.modelName
      );

      this.setState({ selectedLocation: repository ? [repository] : [] });

      const ddStore = this.props.deepdetectStore;

      let defaultConfig = ddStore.settings.services.defaultConfig.find(
        config => {
          return config.modelName === repository.modelName;
        }
      );

      if (defaultConfig) {
        defaultConfig.modelConfig.model.repository = repository.label;
        this.setState({
          jsonConfig: JSON.stringify(defaultConfig.modelConfig, null, 1)
        });
      } else {
        let jsonConfig = JSON.parse(this.state.jsonConfig);
        jsonConfig.model.repository = repository.label;
        this.setState({ jsonConfig: JSON.stringify(jsonConfig, null, 1) });
      }
    }
  }

  handleInputServiceNameChange(evt) {
    this.setState({ serviceName: evt.target.value });
  }

  handleInputDescriptionChange(evt) {
    const description = evt.target.value;

    let jsonConfig = JSON.parse(this.state.jsonConfig);

    if (description.length > 0) jsonConfig.description = description;

    this.setState({
      description: description,
      jsonConfig: JSON.stringify(jsonConfig, null, 1)
    });
  }

  handleInputChange() {
    this.props.modelRepositoriesStore.load();
    const typeahead = this.typeahead.getInstance();

    const serviceModelLocation = typeahead.getInput().value;

    const repository = this.props.modelRepositoriesStore.repositories.find(
      r => r.label === serviceModelLocation
    );
    this.setState({ selectedLocation: repository ? [repository] : [] });

    let jsonConfig = JSON.parse(this.state.jsonConfig);

    const defaultConfig = this.state.defaultConfig;
    const selectedConfig = typeahead.state.selected[0];

    if (
      typeof selectedConfig !== "undefined" &&
      typeof defaultConfig !== "undefined" &&
      defaultConfig.modelName !== selectedConfig.modelName
    ) {
      const ddStore = this.props.deepdetectStore;
      const newConfig = ddStore.settings.services.defaultConfig.find(config => {
        return config.modelName === selectedConfig.modelName;
      });

      if (typeof newConfig !== "undefined") {
        this.setState({ defaultConfig: newConfig });
        jsonConfig = newConfig.modelConfig;
      }
    }

    if (this.state.description.length > 0)
      jsonConfig.description = this.state.serviceDescription;

    if (serviceModelLocation.length > 0)
      jsonConfig.model.repository = serviceModelLocation;

    this.setState({ jsonConfig: JSON.stringify(jsonConfig, null, 1) });
  }

  validateBeforeSubmit() {
    let errors = [];

    const serviceName = this.state.serviceName;

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

    const serviceModelLocation = this.typeahead.getInstance().getInput().value;

    if (serviceModelLocation.length === 0) {
      errors.push("Model Repository Location can't be empty");
    }

    const { repositories } = this.props.modelRepositoriesStore;
    if (!repositories.map(r => r.label).includes(serviceModelLocation)) {
      errors.push("Model Repository Location must exists in predefined list");
    }

    try {
      JSON.parse(this.state.jsonConfig);
    } catch (e) {
      errors.push("Invalid json in curl command, please check its syntax");
    }

    this.setState({ errors: errors });

    return errors.length === 0;
  }

  submitService() {
    if (!this.validateBeforeSubmit()) {
      return null;
    }

    let serviceName = this.state.serviceName;
    const serviceData = JSON.parse(this.state.jsonConfig);
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
          `/predict/${ddStore.hostableServer.name}/${serviceName}`
        );
      }
    });
  }

  handleCopyClipboard() {
    const store = this.props.deepdetectStore;
    const curlCommand = `curl -X PUT '${window.location.origin}${
      store.server.settings.path
    }/services/${this.state.serviceName}' -d '${this.state.jsonConfig}'`;

    copy(curlCommand);

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  handleCurlChange(editor, data, value) {
    const store = this.props.deepdetectStore;
    const curlCommand = `curl -X PUT '${window.location.origin}${
      store.server.settings.path
    }/services/${this.state.serviceName}' -d '`;

    const jsonConfig = value.replace(curlCommand, "").slice(0, -1);
    this.setState({ jsonConfig: jsonConfig });
  }

  //const { recommendedGpuIndex } = this.props.gpuStore;
  // <div className="form-row">
  //            <div className="form-check">
  //              <input className="form-check-input" type="checkbox" value="" id="checkRecommendedGpu"/>
  //              <label className="form-check-label" htmlFor="checkRecommendedGpu">
  //                Use recommended GPU: <b>{recommendedGpuIndex}</b>
  //              </label>
  //            </div>
  //          </div>

  render() {
    const store = this.props.deepdetectStore;

    if (store.servers.length === 0) return null;

    const curlCommand = `curl -X PUT '${window.location.origin}${
      store.server.settings.path
    }/services/${this.state.serviceName}' -d '${this.state.jsonConfig}'`;

    const copiedText = this.state.copied ? "Copied!" : "Copy to clipboard";

    return (
      <div className="widget-service-new">
        <div className="row">
          <h5>New service</h5>
        </div>

        <div className="row">
          <div className="col-md-5">
            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputName">
                Name
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="inlineFormInputName"
                placeholder="Service Name"
                value={this.state.serviceName}
                onChange={this.handleInputServiceNameChange}
              />
            </div>

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputDescription">
                Description
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="inlineFormInputDescription"
                placeholder="Service Description"
                value={this.state.description}
                onChange={this.handleInputDescriptionChange}
              />
            </div>

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputModelLocation">
                Model Location
              </label>
              <Typeahead
                id="inlineFormInputModelLocation"
                ref={typeahead => (this.typeahead = typeahead)}
                options={toJS(this.props.modelRepositoriesStore.repositories)}
                placeholder="Model Repository location"
                onChange={this.handleInputChange}
                defaultSelected={this.state.selectedLocation}
                renderMenu={(results, menuProps) => (
                  <Menu {...menuProps}>
                    {results.map((result, index) => {
                      let badgeClasses = "badge float-right";
                      let badgeText = "Public";
                      if (result.isPublic) {
                        badgeClasses += " badge-primary";
                      } else {
                        badgeClasses += " badge-warning";
                        badgeText = "Private";
                      }

                      return (
                        <MenuItem
                          key={index}
                          option={result}
                          position={index}
                          title={result.label}
                        >
                          {result.label
                            .slice(0, -1)
                            .split("/")
                            .pop()}
                          <span className={badgeClasses}>{badgeText}</span>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                )}
              />
            </div>

            <div className="form-row">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.submitService}
              >
                <i
                  className={
                    this.state.creatingService
                      ? "fas fa-spinner fa-spin"
                      : "fas fa-angle-right"
                  }
                />&nbsp; Add Service
              </button>
            </div>

            <div
              className="alert alert-danger"
              role="alert"
              style={{
                marginTop: "10px",
                display: this.state.errors.length > 0 ? "" : "none"
              }}
            >
              <b>Error while creating service</b>
              <ul>
                {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
              </ul>
            </div>
          </div>

          <div className="col-md-7">
            <pre className="curl-command">
              <div className="heading">
                CURL{" "}
                <span className="clipboard" onClick={this.handleCopyClipboard}>
                  {copiedText}
                </span>
              </div>
              <div className="code-wrap">
                <CodeMirror
                  value={curlCommand}
                  onBeforeChange={this.handleCurlChange}
                  onChange={this.handleCurlChange}
                  options={{
                    smartIndent: false
                  }}
                />
              </div>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
