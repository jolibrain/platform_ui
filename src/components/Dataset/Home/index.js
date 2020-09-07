import React from "react";
import { inject } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

@inject("deepdetectStore")
@inject("configStore")
class DatasetHome extends React.Component {
  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Dataset") ||
      this.props.configStore.isComponentBlacklisted("DatasetHome")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar dataset-home-component">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
export default DatasetHome;
