import React from 'react';
import { inject, observer } from 'mobx-react';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

@inject('commonStore')
@inject('deepdetectStore')
@observer
export default class ServiceNew extends React.Component {

  constructor(props) {
    super(props);
    this.serviceNameRef = React.createRef();

    this.submitService = this.submitService.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);

    this.state = {
      config: {},
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
      <div className="block">
        <div className="context-header">
          <div className="sidebar-context-title">New service</div>
        </div>

        <form>
          <div className="form-row align-items-center">

            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInputName">Name</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputName" placeholder="Service Name" ref={this.serviceNameRef}></input>
            </div>

            <div className="col-auto">
              <CodeMirror
                defaultValue={JSON.stringify(settings.services.defaultConfig, null, 1)}
                options={this.state.inputOptions}
                onChange={this.handleConfigChange}
              />
            </div>

            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-2" onClick={this.submitService}>Add Service</button>
            </div>

          </div>
        </form>

      </div>
    );
  }

}
