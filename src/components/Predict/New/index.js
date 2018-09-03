import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("modelRepositoriesStore")
@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class PredictNew extends React.Component {
  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Predict") ||
      this.props.configStore.isComponentBlacklisted("PredictNew")
    )
      return null;

    const { repositoryStores } = this.props.modelRepositoriesStore;
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
    } else if (repositoryStores.length === 0) {
      return (
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
          <div className="loading alert alert-danger" role="alert">
            <i className="fas fa-times" /> No models repository found in :{" "}
            <code>modelRepositories</code>
            from <code>config.json</code>
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
