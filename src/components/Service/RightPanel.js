import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { parse as qsParse } from "query-string";

import GpuInfo from "../widgets/GpuInfo";
import ServiceInfo from "../widgets/ServiceInfo";
import ServiceTraining from "../widgets/ServiceTraining";

@withRouter
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
