import React from "react";
import { observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

import stores from "../../../stores/rootStore";

const PredictHome = observer(class PredictHome extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = stores;
    deepdetectStore.setTrainRefreshMode(null);
  }

  render() {
    const { configStore } = stores;
    if (
      configStore.isComponentBlacklisted("Predict") ||
      configStore.isComponentBlacklisted("PredictHome")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar predict-home-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
});
export default PredictHome;
