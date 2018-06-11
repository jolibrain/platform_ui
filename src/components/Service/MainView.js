import React from "react";
import { Link, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "./RightPanel";
import Imaginate from "../widgets/Imaginate";

@inject("imaginateStore")
@inject("deepdetectStore")
@inject("modalStore")
@withRouter
@observer
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteServiceModal = this.openDeleteServiceModal.bind(this);
  }

  openDeleteServiceModal() {
    this.props.modalStore.setVisible("deleteService");
  }

  componentWillReceiveProps(nextProps) {
    const serviceName = this.props.match.params.serviceName;
    const newServiceName = nextProps.match.params.serviceName;

    if (serviceName !== newServiceName) {
      this.props.imaginateStore.imgList = [];
    }
  }

  render() {
    const ddStore = this.props.deepdetectStore;

    const server = ddStore.server;

    if (!server) return null;

    const service = ddStore.service;

    if (!service) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">DeepDetect</Link> >&nbsp;
            <Link to="/predict">Predict</Link> >&nbsp;
            <Link to={`/predict/${server.name}`}>{server.name}</Link> >&nbsp;
            <Link to={`/predict/${server.name}/${service.name}`}>
              {service.name}
            </Link>
          </div>
          <nav className="navbar navbar-expand-lg">
            <ul
              className="nav navbar-nav ml-auto"
              style={{ flexDirection: "row" }}
            >
              {server.settings.isWritable ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={this.openDeleteServiceModal}
                  >
                    Delete Service
                  </button>
                </li>
              ) : (
                ""
              )}
              <li className="nav-item">
                <Link to="/predict/new" className="btn btn-outline-primary">
                  New Service
                </Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <Imaginate />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
