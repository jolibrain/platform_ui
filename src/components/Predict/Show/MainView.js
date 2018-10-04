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

  componentWillMount() {
    const { server, service } = this.props.deepdetectStore;

    if (!server || !service) {
      this.props.history.push("/");
    }
  }

  render() {
    const { server, service } = this.props.deepdetectStore;
    if (!server || !service) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <Breadcrumb service={service} />
          <nav className="navbar navbar-expand-lg">
            <ul
              className="nav navbar-nav ml-auto"
              style={{ flexDirection: "row" }}
            >
              {server.settings.isWritable ? (
                <li className="nav-item">
                  <button
                    id="openDeleteService"
                    className="btn btn-outline-danger"
                    onClick={this.openDeleteServiceModal}
                  >
                    <i className="far fa-trash-alt" /> Delete Service
                  </button>
                </li>
              ) : (
                ""
              )}
              <li className="nav-item">
                <Link to="/predict" className="btn btn-outline-primary">
                  <i className="fas fa-plus" /> New Service
                </Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <Imaginate />
            <RightPanel serviceInfo includeDownloadPanel />
          </div>
        </div>
      </div>
    );
  }
}
