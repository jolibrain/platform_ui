import React from "react";

import Header from "../Header";
import LeftPanel from "./LeftPanel";
import MainView from "./MainView";

class GenericNotFound extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar generic-not-found">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
export default GenericNotFound;
