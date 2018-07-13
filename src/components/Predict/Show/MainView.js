import React from "react";
import { Link, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import Imaginate from "../../widgets/Imaginate";
import Breadcrumb from "../../widgets/Breadcrumb";

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
    console.log(nextProps);
    this.setDeepdetectServer(nextProps.match.params);
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
          <Breadcrumb server={server} service={service} />
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
            <RightPanel serviceInfo={true} />
          </div>
        </div>
      </div>
    );
  }
}
