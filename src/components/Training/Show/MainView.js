import React from "react";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import TrainingMonitor from "../../widgets/TrainingMonitor";
import Breadcrumb from "../../widgets/Breadcrumb";

@inject("deepdetectStore")
@inject("modalStore")
@observer
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.openStopTrainingModal = this.openStopTrainingModal.bind(this);
  }

  openStopTrainingModal() {
    this.props.modalStore.setVisible("stopTraining");
  }

  render() {
    const ddStore = this.props.deepdetectStore;

    const server = ddStore.server;

    if (!server) return null;

    const service = ddStore.service;

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
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={this.openStopTrainingModal}
                >
                  Stop training
                </button>
              </li>
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
