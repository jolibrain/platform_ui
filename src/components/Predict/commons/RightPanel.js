import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../../widgets/GpuInfo";
import DownloadModelFiles from "../../widgets/DownloadModelFiles";
import ServiceInfo from "../../widgets/ServiceInfo";

@inject("configStore")
@inject("modelRepositoriesStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class RightPanel extends React.Component {
  render() {
    const { configStore, modelRepositoriesStore, deepdetectStore } = this.props;

    if (typeof configStore.gpuInfo === "undefined") return null;

    const { serviceInfo, includeDownloadPanel } = this.props;

    let serviceName = null;
    if (deepdetectStore.server.service)
      serviceName = deepdetectStore.server.service.name;

    let downloadPanel = "";
    if (serviceName && includeDownloadPanel) {
      const repository = modelRepositoriesStore.privateRepositories.find(
        r => r.name === deepdetectStore.server.service.name
      );
      if (repository) {
        downloadPanel = <DownloadModelFiles repository={repository} />;
      }
    }

    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          {serviceInfo ? <ServiceInfo /> : ""}
          {downloadPanel}
          <GpuInfo />
        </div>
      </aside>
    );
  }
}
