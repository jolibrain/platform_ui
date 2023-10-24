import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../../widgets/GpuInfo";
import PlaceHolder from "../../widgets/PlaceHolder";

import stores from "../../../stores/rootStore";

const RightPanel = withRouter(observer(class RightPanel extends React.Component {
  render() {
    const { configStore, gpuStore } = stores;

    if (
      configStore.isComponentBlacklisted("RightPanel") ||
      typeof configStore.gpuInfo === "undefined" ||
        gpuStore.servers.length === 0
    ) {
      return null;
    }

    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <PlaceHolder config="sidebar_right_top" />
          <GpuInfo />
          <PlaceHolder config="sidebar_right_bottom" />
        </div>
      </aside>
    );
  }
}));
export default RightPanel;
