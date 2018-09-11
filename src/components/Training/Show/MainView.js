import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import TrainingMonitor from "../../widgets/TrainingMonitor";
import Breadcrumb from "../../widgets/Breadcrumb";

@inject("deepdetectStore")
@inject("modalStore")
@observer
@withRouter
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredMeasure: -1
    };

    this.openStopTrainingModal = this.openStopTrainingModal.bind(this);
    this.handleOverMeasure = this.handleOverMeasure.bind(this);
    this.handleLeaveMeasure = this.handleLeaveMeasure.bind(this);
  }

  openStopTrainingModal() {
    this.props.modalStore.setVisible("deleteService");
  }

  handleOverMeasure(index) {
    this.setState({ hoveredMeasure: index });
  }

  handleLeaveMeasure(index) {
    this.setState({ hoveredMeasure: -1 });
  }

  render() {
    if (!this.props.deepdetectStore.isReady) return null;

    const { services } = this.props.deepdetectStore;

    const { params } = this.props.match;
    const service = services.find(s => {
      return (
        s.name === params.serviceName && s.serverName === params.serverName
      );
    });

    if (!service) {
      this.props.history.push("/");
      return null;
    }

    if (!service.respTraining) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <Breadcrumb service={service} isTraining={true} />
          <nav className="navbar navbar-expand-lg">
            <ul
              className="nav navbar-nav ml-auto"
              style={{ flexDirection: "row" }}
            >
              {service.serverSettings.isWritable ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={this.openStopTrainingModal}
                  >
                    Stop Training
                  </button>
                </li>
              ) : (
                ""
              )}
            </ul>
          </nav>
          <div className="content">
            <TrainingMonitor
              service={service}
              handleOverMeasure={this.handleOverMeasure}
              handleLeaveMeasure={this.handleLeaveMeasure}
              hoveredMeasure={this.state.hoveredMeasure}
            />
            <RightPanel
              service={service}
              handleOverMeasure={this.handleOverMeasure}
              handleLeaveMeasure={this.handleLeaveMeasure}
              hoveredMeasure={this.state.hoveredMeasure}
              includeDownloadPanel
            />
          </div>
        </div>
      </div>
    );
  }
}
