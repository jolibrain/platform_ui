import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../../widgets/GpuInfo";
import ServiceInfo from "../../widgets/ServiceInfo";
import TrainingMeasure from "../../widgets/TrainingMeasure";
import DownloadModelFiles from "../../widgets/DownloadModelFiles";

@inject("configStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class RightPanel extends React.Component {
  render() {
    const { configStore, modelRepositoriesStore } = this.props;

    if (typeof configStore.gpuInfo === "undefined") return null;

    const {
      service,
      serviceInfo,
      includeDownloadPanel,
      handleOverMeasure
    } = this.props;

    let widgets = [];

    if (serviceInfo) widgets.push(<ServiceInfo key="ServiceInfo" />);

    if (service && handleOverMeasure)
      widgets.push(<TrainingMeasure key="TrainingMeasure" {...this.props} />);

    if (service && service.name && includeDownloadPanel) {
      const repository = modelRepositoriesStore.privateRepositories.find(
        r => r.name === service.name
      );
      if (repository) {
        widgets.push(
          <DownloadModelFiles
            key="DownloadModelFiles"
            repository={repository}
          />
        );
      }
    }

    widgets.push(<GpuInfo key="GpuInfo" />);

    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">{widgets}</div>
      </aside>
    );
  }
}

RightPanel.propTypes = {
  configStore: PropTypes.object,
  searviceInfo: PropTypes.object,
  service: PropTypes.object,
  handleOverMeasure: PropTypes.func,
  handleLeaveMeasure: PropTypes.func,
  hoveredMeasure: PropTypes.number
};
