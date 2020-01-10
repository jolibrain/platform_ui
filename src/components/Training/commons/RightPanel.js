import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../../widgets/GpuInfo";
import PlaceHolder from "../../widgets/PlaceHolder";

@inject("configStore")
@withRouter
@observer
export default class RightPanel extends React.Component {
  render() {
    const { configStore } = this.props;

    if (typeof configStore.gpuInfo === "undefined") return null;

    let widgets = [];

    widgets.push(<GpuInfo key="GpuInfo" />);

    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <PlaceHolder config="sidebar_right_top" />
          {widgets}
          <PlaceHolder config="sidebar_right_bottom" />
        </div>
      </aside>
    );
  }
}

RightPanel.propTypes = {
  configStore: PropTypes.object
};
