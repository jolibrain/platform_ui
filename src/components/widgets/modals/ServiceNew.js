import React from "react";
import { inject, observer } from "mobx-react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

@inject("commonStore")
@inject("deepdetectStore")
@observer
export default class ServiceNew extends React.Component {
  constructor(props) {
    super(props);
    this.serviceNameRef = React.createRef();

    this.submitService = this.submitService.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);

    this.state = {
      config: this.props.deepdetectStore.settings.services.defaultConfig,
      inputOptions: {
        mode: "javascript"
      }
    };
  }

  handleConfigChange(newValue) {
    this.setState({ config: newValue });
  }

  submitService() {
    const serviceName = this.serviceNameRef.current.value;
    const serviceData = this.state.config;
    this.props.deepdetectStore.newService(serviceName, serviceData);
  }

  render() {
    const { settings } = this.props.deepdetectStore;

    if (settings == null) return null;

    return (
      <div>
        <div className="modal-header">
          <h5 className="modal-title">New service</h5>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <label className="sr-only" htmlFor="inlineFormInputName">
              Name
            </label>
            <input
              type="text"
              className="form-control mb-2"
              id="inlineFormInputName"
              placeholder="Service Name"
              ref={this.serviceNameRef}
            />
          </div>

          <div className="form-row">
            <CodeMirror
              value={JSON.stringify(settings.services.defaultConfig, null, 1)}
              options={this.state.inputOptions}
              onChange={this.handleConfigChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-primary mb-2"
            onClick={this.submitService}
          >
            Add Service
          </button>
        </div>
      </div>
    );
  }
}
