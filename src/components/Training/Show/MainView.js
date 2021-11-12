import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";

import Title from "../../widgets/TrainingMonitor/components/Title";
import GeneralInfo from "../../widgets/TrainingMonitor/components/GeneralInfo";

import Breadcrumb from "../../widgets/Breadcrumb";

@inject("deepdetectStore")
@inject("modalStore")
@inject("configStore")
@inject("gpuStore")
@observer
@withRouter
class MainView extends React.Component {
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

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof this.props.configStore.gpuInfo !== "undefined" &&
        this.props.gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        <div className="fluid-container">
          <Title service={service} />
          <div className="training-breadcrumb px-4 py-2">
            <Breadcrumb service={service} isTraining={true} />
          </div>
          <div className="content p-4">
            <GeneralInfo services={[service]} />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
