import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";

export default class PredictHome extends React.Component {
  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar predict-home-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
