import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("commonStore")
@inject("modelRepositoriesStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class ServiceNew extends React.Component {
  render() {
    const {
      isLoaded,
      repositories,
      settings
    } = this.props.modelRepositoriesStore;

    const { services } = this.props.deepdetectStore.settings;

    if (services.length === 0) {
      return (
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
          <div className="loading alert alert-danger" role="alert">
            <i className="fas fa-times" /> No services configured in :{" "}
            <code>deepdetect.services.defaultConfig</code>
            from <code>config.json</code>
          </div>
        </div>
      );
    } else if (!isLoaded || typeof repositories === "undefined") {
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
            <code>{settings.systemPath.public}</code> or{" "}
            <code>{settings.systemPath.public}</code>
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
