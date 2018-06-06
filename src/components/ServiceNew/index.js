import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("commonStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class ServiceNew extends React.Component {
  render() {
    const {
      isLoaded,
      repositories,
      settings
    } = this.props.modelRepositoriesStore;

    if (!isLoaded || typeof repositories === "undefined") {
      return (
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
          <div className="loading alert alert-primary" role="alert">
            <i class="fas fa-spinner fa-spin" /> Loading repositories...
          </div>
        </div>
      );
    } else if (repositories.length === 0) {
      return (
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
          <div className="loading alert alert-danger" role="alert">
            <i class="fas fa-times" /> No models repository found in :{" "}
            <code>{settings.systemPath}</code>
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
