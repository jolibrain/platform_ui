import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject } from "mobx-react";

@inject("configStore")
export default class PredictHome extends React.Component {
  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Predict") ||
      this.props.configStore.isComponentBlacklisted("PredictHome")
    )
      return null;

    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar predict-home-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
