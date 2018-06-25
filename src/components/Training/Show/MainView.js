import React from "react";
import { Link, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "./RightPanel";

@inject("deepdetectStore")
@inject("modalStore")
@withRouter
@observer
export default class Training extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteServiceModal = this.openDeleteServiceModal.bind(this);
  }

  openDeleteServiceModal() {
    this.props.modalStore.setVisible("deleteService");
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
                <Link to="/training/new" className="btn btn-outline-primary">
                  New Service
                </Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
