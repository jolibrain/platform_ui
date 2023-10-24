import React from "react";
import { withRouter } from "react-router-dom";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import copy from "copy-to-clipboard";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";
//import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

import stores from "../../../stores/rootStore";

const Form = withRouter(observer(class Form extends React.Component {
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

    this.typeaheadRef = React.createRef();

    const { deepdetectStore } = stores;

    let defaultConfig = deepdetectStore.settings.services.defaultConfig.find(config => {
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
    const { deepdetectStore, modelRepositoriesStore } = stores;
    if (!modelRepositoriesStore.isReadyPredict) {
      modelRepositoriesStore.refreshPredict();
    }

    if (this.props.location.state && this.props.location.state.repository) {
      const repository = this.props.location.state.repository;

      this.setState({ selectedLocation: repository ? [repository.name] : [] });

      let defaultConfig = deepdetectStore.settings.services.defaultConfig.find(
        config => {
          return config.modelName === repository.modelName;
        }
      );

      if (defaultConfig) {
        defaultConfig.modelConfig.model.repository = repository.name;
        this.setState({
          jsonConfig: JSON.stringify(defaultConfig.modelConfig, null, 1)
        });
      } else {
        let jsonConfig = JSON.parse(this.state.jsonConfig);
        jsonConfig.model.repository = repository.location;
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
    const { modelRepositoriesStore, deepdetectStore } = stores;
    const selectedServiceName = this.typeaheadRef.current.getInput().value;

    const repository = modelRepositoriesStore.repositories.find(
      r => r.name === selectedServiceName
    );
    this.setState({ selectedLocation: repository ? [repository.name] : [] });

    const serviceModelLocation = repository ? repository.location : "";

    let jsonConfig = JSON.parse(this.state.jsonConfig);

    const defaultConfig = this.state.defaultConfig;
    const selectedConfig = this.typeaheadRef.current.state.selected[0];

    if (
      typeof selectedConfig !== "undefined" &&
      typeof defaultConfig !== "undefined" &&
      defaultConfig.modelName !== selectedConfig.modelName
    ) {
      const newConfig = deepdetectStore.settings.services.defaultConfig.find(config => {
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
    const { modelRepositoriesStore, deepdetectStore } = stores;
    let errors = [];

    const serviceName = this.state.serviceName;

    if (serviceName.length === 0) {
      errors.push("Service name can't be empty");
    }

    if (serviceName === "new") {
      errors.push("Service name can't be named 'new'");
    }

    const serviceNames = deepdetectStore.server.services.map(s => s.name.toLowerCase());

    if (serviceNames.includes(serviceName.toLowerCase())) {
      errors.push("Service name already exists");
    }

    const serviceModelLocation = this.typeaheadRef.current.getInput().value;

    if (serviceModelLocation.length === 0) {
      errors.push("Model Repository Location can't be empty");
    }

    const { repositories } = modelRepositoriesStore;
    if (!repositories.map(r => r.name).includes(serviceModelLocation)) {
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
    const { deepdetectStore } = stores;
    if (!this.validateBeforeSubmit()) {
      return null;
    }

    let serviceName = this.state.serviceName;

    this.setState({ creatingService: true });

    let serviceData = JSON.parse(this.state.jsonConfig);

    if (serviceData.parameters.output) {
      serviceData.parameters.output.store_config = false;
    } else {
      serviceData.parameters.output = { store_config: false };
    }

    deepdetectStore.newService(serviceName, serviceData, (resp, err) => {
      if (err) {
        this.setState({
          creatingService: false,
          errors: [`${err.status.msg}: ${err.status.dd_msg}`]
        });
      } else {
        this.setState({
          creatingService: false,
          errors: []
        });

        deepdetectStore.setService(serviceName);

        this.props.history.push(
          `/predict/${deepdetectStore.hostableServer.name}/${serviceName}`
        );
      }
    });
  }

  handleCopyClipboard() {
    const { deepdetectStore } = stores;
    const curlCommand = `curl -X PUT '${window.location.origin}${deepdetectStore.server.settings.path}/services/${this.state.serviceName}' -d '${this.state.jsonConfig}'`;

    copy(curlCommand);

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  handleCurlChange(editor, data, value) {
    const { deepdetectStore } = stores;
    const curlCommand = `curl -X PUT '${window.location.origin}${deepdetectStore.server.settings.path}/services/${this.state.serviceName}' -d '`;

    const jsonConfig = value.replace(curlCommand, "").slice(0, -1);
    this.setState({ jsonConfig: jsonConfig });
  }

  //const { recommendedGpuIndex } = gpuStore;
  // <div className="form-row">
  //            <div className="form-check">
  //              <input className="form-check-input" type="checkbox" value="" id="checkRecommendedGpu"/>
  //              <label className="form-check-label" htmlFor="checkRecommendedGpu">
  //                Use recommended GPU: <b>{recommendedGpuIndex}</b>
  //              </label>
  //            </div>
  //          </div>

  render() {
    const { deepdetectStore, modelRepositoriesStore } = stores;

    if (deepdetectStore.servers.length === 0) {
      return (
        <div className="alert alert-warning" role="alert">
          <p>No deepdetect server available.</p>
          <p>
            Please verify your{" "}
            <code>
              <a href="/config.json">config.json</a>
            </code>{" "}
            configuration file.
          </p>
        </div>
      );
    }

    const curlCommand = `curl -X PUT '${window.location.origin}${deepdetectStore.server.settings.path}/services/${this.state.serviceName}' -d '${this.state.jsonConfig}'`;

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
                ref={this.typeaheadRef}
                options={toJS(modelRepositoriesStore.repositories)}
                placeholder="Model Repository location"
                onChange={this.handleInputChange}
                defaultSelected={this.state.selectedLocation}
                filterBy={["name"]}
                renderMenu={(results, menuProps) => {
                  return (
                    <Menu {...menuProps}>
                      {results
                        .filter(r => {
                          return (
                            r.name &&
                            ["public", "private"].includes(r.store.name)
                          );
                        })
                        .map((result, index) => {
                          let badgeClasses = "badge float-right";
                          let badgeText = result.store.name;
                          if (badgeText === "public") {
                            badgeClasses += " badge-primary";
                          } else {
                            badgeClasses += " badge-warning";
                          }

                          return (
                            <MenuItem
                              key={index}
                              option={result.name}
                              position={index}
                              title={result.name}
                            >
                              {result.name.split("/").pop()}
                              <span className={badgeClasses}>{badgeText}</span>
                            </MenuItem>
                          );
                        })}
                    </Menu>
                  );
                }}
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
                />
                &nbsp; Add Service
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
                {this.state.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
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
}));
export default Form;
