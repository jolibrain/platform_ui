import React from "react";

import ServiceList from "../../widgets/ServiceList";
import PlaceHolder from "../../widgets/PlaceHolder";

const LeftPanel = class LeftPanel extends React.Component {
  render() {
    return (
      <div className="nav-sidebar left-sidebar">
        <div className="nav-sidebar-inner-scroll">
          <PlaceHolder config="sidebar_left_top" />
          <ServiceList only="training" />
          <PlaceHolder config="sidebar_left_bottom" />
        </div>
      </div>
    );
  }
};
export default LeftPanel;
