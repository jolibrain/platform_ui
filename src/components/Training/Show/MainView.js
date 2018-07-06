import React from "react";
import { Link, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import TrainingMonitor from "../../widgets/TrainingMonitor";

@inject("deepdetectStore")
@inject("modalStore")
@withRouter
@observer
export default class Training extends React.Component {
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

    if (!service) return null;

    if (!service.trainMeasure) {
      return (
        <div className="main-view content-wrapper">
          <div className="container">
            <div className="breadcrumbs">
              <Link to="/">DeepDetect</Link> >&nbsp;
              <Link to="/training">Training</Link> >&nbsp;
              <Link to={`/training/${server.name}`}>{server.name}</Link> >&nbsp;
              <Link to={`/training/${server.name}/${service.name}`}>
                {service.name}
              </Link>
            </div>
            <div className="content">
              <div className="loading alert alert-primary" role="alert">
                This job is not currently training.
              </div>
              <RightPanel />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-view content-wrapper">
          <div className="container">
            <div className="breadcrumbs">
              <Link to="/">DeepDetect</Link> >&nbsp;
              <Link to="/training">Training</Link> >&nbsp;
              <Link to={`/training/${server.name}`}>{server.name}</Link> >&nbsp;
              <Link to={`/training/${server.name}/${service.name}`}>
                {service.name}
              </Link>
            </div>
            <nav className="navbar navbar-expand-lg">
              <ul
                className="nav navbar-nav ml-auto"
                style={{ flexDirection: "row" }}
              >
                <li className="nav-item">
                  <a className="btn btn-secondary" href={service.urlGetService}>
                    Service JSON
                  </a>
                </li>
                <li className="nav-item">
                  <a className="btn btn-secondary" href={service.urlTraining}>
                    Training JSON
                  </a>
                </li>
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
              <RightPanel />
            </div>
          </div>
        </div>
      );
    }
  }
}
