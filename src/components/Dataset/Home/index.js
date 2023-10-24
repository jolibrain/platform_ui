import React from "react";
import { observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

import stores from "../../../stores/rootStore";

const DatasetHome = observer(class DatasetHome extends React.Component {
  render() {
    const { configStore } = stores;
    if (
      configStore.isComponentBlacklisted("Dataset") ||
      configStore.isComponentBlacklisted("DatasetHome")
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
});
export default DatasetHome;
