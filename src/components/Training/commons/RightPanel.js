import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../../widgets/GpuInfo";
import PlaceHolder from "../../widgets/PlaceHolder";

@inject("configStore")
@withRouter
@observer
class RightPanel extends React.Component {
  render() {

    if (
      typeof this.props.configStore.gpuInfo === "undefined" ||
        this.props.gpuStore.servers.length === 0
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
}

RightPanel.propTypes = {
  configStore: PropTypes.object
};
export default RightPanel;
