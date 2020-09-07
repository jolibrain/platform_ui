import React from "react";

import GpuInfo from "../widgets/GpuInfo";

class RightPanel extends React.Component {
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
export default RightPanel;
