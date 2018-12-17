import React from "react";

import Header from "../Header";
import LeftPanel from "./LeftPanel";
import MainView from "./MainView";

export default class Loading extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar loading-component">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
