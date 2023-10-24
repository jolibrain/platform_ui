import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

import stores from "../../../stores/rootStore";

const PredictNew = withRouter(observer(class PredictNew extends React.Component {
  componentWillMount() {
    const { deepdetectStore, modelRepositoriesStore } = stores;
    if (!modelRepositoriesStore.isReadyPredict) {
      modelRepositoriesStore.refreshPredict();
    }
    deepdetectStore.setTrainRefreshMode(null);
  }

  render() {

    const {
      configStore,
      deepdetectStore,
      modelRepositoriesStore
    } = stores;

    if (
      configStore.isComponentBlacklisted("Predict") ||
      configStore.isComponentBlacklisted("PredictNew")
    )
      return null;

    const { repositoryStores } = modelRepositoriesStore;
    const { services } = deepdetectStore.settings;

    if (services.length === 0) {
      return (
        <div>
          <Header />
          <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
            <div className="loading alert alert-danger" role="alert">
              <i className="fas fa-times" /> No services configured in :{" "}
              <code>deepdetect.services.defaultConfig</code>
              from <code>config.json</code>
            </div>
          </div>
        </div>
      );
    } else if (repositoryStores.length === 0) {
      return (
        <div>
          <Header />
          <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
            <div className="loading alert alert-danger" role="alert">
              <i className="fas fa-times" /> No models repository found in :{" "}
              <code>modelRepositories</code>
              from <code>config.json</code>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-new">
            <LeftPanel />
            <MainView />
          </div>
        </div>
      );
    }
  }
}));
export default PredictNew;
