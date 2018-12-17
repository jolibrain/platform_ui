import React from "react";
import { inject } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

@inject("deepdetectStore")
@inject("configStore")
export default class PredictHome extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode(null);
  }

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Predict") ||
      this.props.configStore.isComponentBlacklisted("PredictHome")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar predict-home-component">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
