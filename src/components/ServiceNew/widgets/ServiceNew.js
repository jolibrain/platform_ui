import React from 'react';
import { inject, observer } from 'mobx-react';

import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

@inject('commonStore')
@inject('deepdetectStore')
@observer
export default class ServiceNew extends React.Component {

  constructor(props) {
    super(props);
    this.serviceNameRef = React.createRef();
    this.serviceDescriptionRef = React.createRef();
    this.serviceModelLocationRef = React.createRef();

    this.submitService = this.submitService.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);

    this.state = {
      config: this.props.deepdetectStore.settings.services.defaultConfig,
      inputOptions: {
        mode: 'javascript'
      }
    };
  }

  handleConfigChange(newValue) {
    this.setState({config: newValue});
  }

  submitService() {
    const serviceName = this.serviceNameRef.current.value;
    const serviceData = this.state.config;
    this.props.deepdetectStore.newService(serviceName, serviceData);
  }

  render() {

    const { settings } = this.props.deepdetectStore;

    if(settings == null)
      return null;

    return (
      <div className="widget-service-new">

        <div className="row">
          <h5>New service</h5>
        </div>

        <div className="row">

          <div className="col-md-6">

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputName">Name</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputName" placeholder="Service Name" ref={this.serviceNameRef}></input>
            </div>

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputDescription">Description</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputDescription" placeholder="Service Description" ref={this.serviceDescriptionRef}></input>
            </div>

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputModelLocation">Model Location</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputModelLocation" placeholder="Service Model Location" ref={this.serviceModelLocationRef}></input>
            </div>

            <button type="submit" className="btn btn-primary" onClick={this.submitService}>Add Service</button>

          </div>

          <div className="col-md-6">

            <div className="form-row">
              <CodeMirror
                value={JSON.stringify(this.state.config, null, 1)}
                options={this.state.inputOptions}
                onChange={this.handleConfigChange}
              />
            </div>

          </div>

        </div>

      </div>
    );
  }

}
