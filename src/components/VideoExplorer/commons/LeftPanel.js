import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceList from "../../widgets/ServiceList";
import PlaceHolder from "../../widgets/PlaceHolder";

import ProcessingStatus from "../../widgets/VideoExplorer/ProcessingStatus";

import stores from "../../../stores/rootStore";

const LeftPanel = withRouter(observer(class LeftPanel extends React.Component {
  render() {
    const { configStore } = stores;

    if (configStore.isComponentBlacklisted("LeftPanel"))
      return null;

    return (
      <div className="nav-sidebar left-sidebar">
        <div className="nav-sidebar-inner-scroll">
          <PlaceHolder config="sidebar_left_top" />
          <ProcessingStatus />
          <ServiceList />
          <PlaceHolder config="sidebar_left_bottom" />
        </div>
      </div>
    );
  }
}));
export default LeftPanel;
