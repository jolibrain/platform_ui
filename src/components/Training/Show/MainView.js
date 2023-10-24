import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";

import Title from "../../widgets/TrainingMonitor/components/Title";
import GeneralInfo from "../../widgets/TrainingMonitor/components/GeneralInfo";
import MeasureHistArray from "../../widgets/TrainingMonitor/components/MeasureHistArray";

import Breadcrumb from "../../widgets/Breadcrumb";

import stores from "../../../stores/rootStore";

const MainView = withRouter(observer(class MainView extends React.Component {
  render() {
    const { configStore, deepdetectStore, gpuStore } = stores;
    if (!deepdetectStore.isReady) return null;

    const { services } = deepdetectStore;

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
      typeof configStore.gpuInfo !== "undefined" &&
        gpuStore.servers.length > 0
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
            <MeasureHistArray services={[service]} />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}));
export default MainView;
