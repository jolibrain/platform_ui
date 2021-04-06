import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceList from "../../widgets/ServiceList";
import PlaceHolder from "../../widgets/PlaceHolder";

@inject("configStore")
@withRouter
@observer
class LeftPanel extends React.Component {
  render() {

    if (
      this.props.configStore.isComponentBlacklisted("LeftPanel")
    )
      return null;

    return (
      <div className="nav-sidebar left-sidebar">
        <div className="nav-sidebar-inner-scroll">
          <PlaceHolder config="sidebar_left_top" />
          <ServiceList />
          <PlaceHolder config="sidebar_left_bottom" />
        </div>
      </div>
    );
  }
}
export default LeftPanel;
