import React from "react";
import { withRouter } from "react-router-dom";
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
    const { deepdetectStore } = this.props;
    if (!deepdetectStore.isReady) return null;

    const { server, service } = deepdetectStore;

    if (!server || !service) {
      this.props.history.push("/");
    }
  }

  render() {
    const { deepdetectStore } = this.props;
    if (!deepdetectStore.isReady) return null;

    const { server, service } = deepdetectStore;
    if (!server || !service) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <Breadcrumb service={service} />
          <div className="content">
            <Imaginate />
            <RightPanel serviceInfo includeDownloadPanel />
          </div>
        </div>
      </div>
    );
  }
}
