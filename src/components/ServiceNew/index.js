import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("commonStore")
@withRouter
@observer
export default class ServiceNew extends React.Component {
  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
