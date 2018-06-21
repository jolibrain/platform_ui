import React from "react";
import { observer } from "mobx-react";

import GpuInfo from "../widgets/GpuInfo";
import ServiceInfo from "../widgets/ServiceInfo";
import ServiceTraining from "../widgets/ServiceTraining";

@observer
export default class RightPanel extends React.Component {
  render() {
    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <GpuInfo />
          <ServiceInfo />
          <ServiceTraining />
        </div>
      </aside>
    );
  }
}
