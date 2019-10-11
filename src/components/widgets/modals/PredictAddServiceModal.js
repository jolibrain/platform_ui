import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("gpuStore")
@inject("modalStore")
@observer
@withRouter
export default class PredictAddServiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      serviceName: "",
      gpuId: 0,
      addErrors: [],
      mediaType: "image"
    };

    this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);
    this.handleAddService = this.handleAddService.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.handleServiceNameChange = this.handleServiceNameChange.bind(this);
    this.handleGpuIdChange = this.handleGpuIdChange.bind(this);
    this.handleMediaChange = this.handleMediaChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { repository } = nextProps;

    if (!repository) return null;

    this.setState({
      serviceName: repository.name,
      addErrors: []
    });
  }

  handleServiceNameChange(event) {
    this.setState({ serviceName: event.target.value.toLowerCase() });
  }

  handleGpuIdChange(event) {
    this.setState({ gpuId: parseInt(event.target.value, 10) });
  }

  handleMediaChange(event) {
    this.setState({ mediaType: event.target.value });
  }

  handleCancel() {
    this.setState({ addErrors: [] });
    this.props.modalStore.setVisible("addService", false);
  }

  validateBeforeSubmit() {
    const { repository } = this.props;
    const { serviceName } = this.state;
    let errors = [];

    if (!repository.jsonConfig) {
      errors.push(
        "No json config file available for this service, use 'New Service' form to create it."
      );
    }

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

    this.setState({ addErrors: errors });

    return errors.length === 0;
  }

  handleAddService() {
    const { repository } = this.props;
    const { serviceName } = this.state;

    if (!this.validateBeforeSubmit()) {
      return null;
    }

    const ddStore = this.props.deepdetectStore;

    this.setState({ spinner: true });

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

    serviceData.parameters.mllib.gpuid = this.state.gpuId;

    ddStore.newService(serviceName, serviceData, (resp, err) => {
      if (err) {
        const message =
          typeof err.status !== "undefined"
            ? `${err.status.msg}: ${err.status.dd_msg}`
            : "Error while creating service";

        this.setState({
          spinner: false,
          addErrors: [message]
        });
      } else {
        this.setState({
          spinner: false,
          addErrors: []
        });

        ddStore.setService(serviceName);
        ddStore.service.uiParams.mediaType = this.state.mediaType;

        this.props.modalStore.setVisible("addService", false);

        const serviceUrl = `/predict/${ddStore.hostableServer.name}/${serviceName}`;
        this.props.history.push(serviceUrl);
      }
    });
  }

  render() {
    const { serviceName, gpuId } = this.state;
    const { hostableServer } = this.props.deepdetectStore;
    const { servers } = this.props.gpuStore;
    const gpuStoreServer = servers.find(
      s =>
        s.name === hostableServer.name ||
        s.aliases.includes(hostableServer.name)
    );

    // TODO: restore mjpeg selector
    //<div className="form-check form-check-inline">
    //  <input
    //    className="form-check-input"
    //    type="radio"
    //    name="inlineRadioMediaOptions"
    //    value="mjpeg"
    //  />
    //  <label className="form-check-label">
    //    <span className="badge badge-pill">
    //      <i className="fas fa-film"></i> MJpeg
    //    </span>
    //  </label>
    //</div>

    return (
      <div id="modal-addService">
        <div className="modal-header">
          <h5 className="modal-title">Add Service</h5>
        </div>

        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="serviceName">Service Name</label>
              <input
                type="text"
                className="form-control"
                id="serviceName"
                aria-describedby="serviceNameHelp"
                placeholder="Enter service name"
                value={serviceName}
                onChange={this.handleServiceNameChange}
              />
              <small id="serviceNameHelp" className="form-text text-muted">
                name of the Predict service, it must be unique.
              </small>
            </div>
            {gpuStoreServer && gpuStoreServer.gpuInfo ? (
              <div className="form-group">
                <label>GPU Id</label>
                <div className="form-group" onChange={this.handleGpuIdChange}>
                  {gpuStoreServer.gpuInfo.gpus.map((gpu, index) => {
                    return (
                      <div className="form-check form-check-inline" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="inlineRadioOptions"
                          id={`inlineGpu${index}`}
                          defaultChecked={gpuId === index}
                          value={index}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`inlineGpu${index}`}
                        >
                          <span className="badge badge-pill">
                            <i className="far fa-hdd" /> {index}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                <small id="gpuIdHelp" className="form-text text-muted">
                  GPU id of the GPU to use for this service, see right sidebar
                  indexes
                </small>
              </div>
            ) : (
              <div className="form-group">
                <label>GPU Id</label>
                <small id="gpuIdHelp" className="form-text text-muted">
                  No gpu found for <code>{hostableServer.name}</code> server.
                </small>
              </div>
            )}
            <div className="form-group">
              <label>Media Type</label>
              <div className="form-group" onChange={this.handleMediaChange}>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioMediaOptions"
                    defaultChecked="checked"
                    value="image"
                  />
                  <label className="form-check-label">
                    <span className="badge badge-pill">
                      <i className="fas fa-image"></i> Images
                    </span>
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioMediaOptions"
                    value="webcam"
                  />
                  <label className="form-check-label">
                    <span className="badge badge-pill">
                      <i className="fas fa-camera"></i> Webcam
                    </span>
                  </label>
                </div>
              </div>
              <small id="mediaTypeHelp" className="form-text text-muted">
                The type of media that would be use in this service.
              </small>
            </div>
          </form>

          {this.state.addErrors && this.state.addErrors.length > 0 ? (
            <div className="alert alert-danger" role="alert">
              <p>
                <b>
                  {this.state.addErrors > 1 ? "Errors" : "Error"} while adding
                  service
                </b>
              </p>
              <ul>
                {this.state.addErrors.map((error, index) => {
                  return <li key={index}>{error}</li>;
                })}
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-outline-primary mb-2"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary mb-2"
            onClick={this.handleAddService}
          >
            {this.state.spinner ? (
              <span>
                <i className="fas fa-spinner fa-spin" /> Adding Service...
              </span>
            ) : (
              <span>
                <i className="fas fa-plus" /> Add Service
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}
