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
    this.openStopTrainingModal = this.openStopTrainingModal.bind(this);
  }

  openStopTrainingModal() {
    this.props.modalStore.setVisible("stopTraining");
  }

  render() {
    const { server } = this.props.deepdetectStore;
    if (!server) return null;

    const service = server.service;

    if (!service) {
      this.props.history.push("/");
      return null;
    }

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <Breadcrumb service={service} server={server} isTraining={true} />
          <nav className="navbar navbar-expand-lg">
            <ul
              className="nav navbar-nav ml-auto"
              style={{ flexDirection: "row" }}
            >
              {server.settings.isWritable ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={this.openStopTrainingModal}
                  >
                    {service.isTraining ? "Stop Training" : "Delete Service"}
                  </button>
                </li>
              ) : (
                ""
              )}
            </ul>
          </nav>
          <div className="content">
            <TrainingMonitor />
            <RightPanel trainingMeasure />
          </div>
        </div>
      </div>
    );
  }
}
