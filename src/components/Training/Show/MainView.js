import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";

import Title from "../../widgets/TrainingMonitor/components/Title";
import GeneralInfo from "../../widgets/TrainingMonitor/components/GeneralInfo";
import PerClassArray from "../../widgets/TrainingMonitor/components/PerClassArray";

import Breadcrumb from "../../widgets/Breadcrumb";

@inject("deepdetectStore")
@inject("modalStore")
@observer
@withRouter
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteServiceModal = this.openDeleteServiceModal.bind(this);
  }

  openDeleteServiceModal() {
    this.props.modalStore.setVisible("deleteService");
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
        <div className="fluid-container">
          <Title service={service} />
          <div className="training-breadcrumb px-4 py-2">
            <Breadcrumb service={service} isTraining={true} />
          </div>
          <div className="content p-4">
            <GeneralInfo service={service} />
            <PerClassArray service={service} />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
