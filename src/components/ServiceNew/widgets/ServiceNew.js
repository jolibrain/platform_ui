import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

@inject('commonStore')
@inject('deepdetectStore')
@inject('modelRepositoriesStore')
@observer
@withRouter
export default class ServiceNew extends React.Component {

  constructor(props) {
    super(props);
    this.serviceNameRef = React.createRef();
    this.serviceDescriptionRef = React.createRef();
    this.serviceModelLocationRef = React.createRef();

    this.submitService = this.submitService.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    let config = this.props.deepdetectStore.settings.services.defaultConfig;
    const defaultModelLocation = this.props.modelRepositoriesStore.repositories[0];

    if(config.model && config.model.repository) {
      config.model.repository = defaultModelLocation;
    }

    this.state = {
      creatingService: false,
      serviceName: 'PLEASE_DEFINE',
      config: JSON.stringify(config, null, 1),
      modelLocation: defaultModelLocation,
      copied: false,
    }

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
  }

  handleConfigChange(newValue) {
    this.setState({config: JSON.stringify(newValue, null, 1)});
  }

  handleInputChange() {
    const serviceName = this.serviceNameRef.current.value;
    const serviceDescription = this.serviceDescriptionRef.current.value;
    const serviceModelLocation = this.state.modelLocation;

    let config = JSON.parse(this.state.config);

    if(serviceName.length > 0)
      this.setState({serviceName: serviceName});

    if(serviceDescription.length > 0)
      config.description = serviceDescription;

    if(serviceModelLocation.length > 0)
      config.model.repository = serviceModelLocation;

    this.setState({config: JSON.stringify(config, null, 1)});
  }

  submitService() {
    const serviceName = this.serviceNameRef.current.value;
    const serviceData = JSON.parse(this.state.config);
    this.setState({creatingService: true});
    this.props.deepdetectStore.newService(serviceName, serviceData, () => {
      this.setState({creatingService: false});
      this.props.history.push(`/predict/${serviceName}`);
    });
  }

  handleCopyClipboard() {
    this.setState({copied: true});
    setTimeout(() => {
      this.setState({copied: false})
    }, 2000);
  }

  render() {

    const { settings } = this.props.deepdetectStore;

    if(settings == null)
      return null;

    const curlCommand = `curl -X PUT 'http://localhost:8000/services/${this.state.serviceName}' -d '${this.state.config}'`;

    let copiedClass = 'btn btn-sm btn-outline-secondary';
    let copiedText = 'Copy to clipboard';

    if(this.state.copied === true) {
      copiedClass = 'btn btn-sm btn-outline-success';
      copiedText = 'Copied';
    }

    return (
      <div className="widget-service-new">

        <div className="row">
          <h5>New service</h5>
        </div>

        <div className="row">

          <div className="col-md-6">

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputName">Name</label>
              <input
                type="text"
                className="form-control mb-2"
                id="inlineFormInputName"
                placeholder="Service Name"
                ref={this.serviceNameRef}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputDescription">Description</label>
              <input
                type="text"
                className="form-control mb-2"
                id="inlineFormInputDescription"
                placeholder="Service Description"
                ref={this.serviceDescriptionRef}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-row">
              <label className="sr-only" htmlFor="inlineFormInputModelLocation">Model Location</label>
              <Typeahead
                id="inlineFormInputModelLocation"
                ref={this.serviceModelLocationRef}
                options={toJS(this.props.modelRepositoriesStore.autocompleteRepositories)}
                placeholder="Model Repository location"
                onChange={this.handleInputChange}
                onSelect={(val) => this.setState({modelLocation: val})}
              />
            </div>

            <button type="submit" className="btn btn-primary" onClick={this.submitService}>
              <FontAwesomeIcon icon="spinner" spin style={this.state.creatingService ? {} : {display: 'none'}}/>&nbsp;
              Add Service
            </button>

          </div>

          <div className="col-md-6">

            <div className="form-row">
              <CopyToClipboard text={curlCommand}
                onCopy={this.handleCopyClipboard}>
                <button type="button" className={copiedClass}>{copiedText}</button>
              </CopyToClipboard>
              <CodeMirror value={curlCommand} />
            </div>

          </div>

        </div>

      </div>
    );
  }

}
