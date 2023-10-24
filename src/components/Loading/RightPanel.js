import React from "react";
import { observer } from "mobx-react";

import GpuInfo from "../widgets/GpuInfo";

import stores from "../../stores/rootStore";

const RightPanel = observer(class RightPanel extends React.Component {
  render() {
    const { configStore, gpuStore } = stores;

    if (
      typeof configStore.gpuInfo === "undefined" ||
        gpuStore.servers.length === 0
    ) {
      return null;
    }

    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <GpuInfo />
        </div>
      </aside>
    );
  }
});
export default RightPanel;
