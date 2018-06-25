import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../../widgets/GpuInfo";

@inject("commonStore")
@withRouter
@observer
export default class RightPanel extends React.Component {
  render() {
    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <GpuInfo />
        </div>
      </aside>
    );
  }
}
