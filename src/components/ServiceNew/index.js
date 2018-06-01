import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("commonStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class ServiceNew extends React.Component {
  render() {
    const { isLoaded, repositories } = this.props.modelRepositoriesStore;

    if (
      !isLoaded ||
      typeof repositories === "undefined" ||
      repositories.length === 0
    ) {
      return (
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
          <div className="alert alert-primary" role="alert">
            <FontAwesomeIcon icon="spinner" spin />&nbsp; Loading
            repositories...
          </div>
        </div>
      );
    } else {
      return (
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
          <LeftPanel />
          <MainView />
        </div>
      );
    }
  }
}
