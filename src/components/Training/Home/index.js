import React from "react";
import { observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

import stores from "../../../stores/rootStore";

const TrainingHome = observer(class TrainingHome extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = stores;
    deepdetectStore.setTrainRefreshMode("services");
  }

  componentWillReceiveProps(nextProps) {
    const { deepdetectStore } = stores;
    deepdetectStore.setTrainRefreshMode("services");
  }

  render() {
    const { configStore } = stores;
    if (
      configStore.isComponentBlacklisted("Training") ||
      configStore.isComponentBlacklisted("TrainingHome")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-home-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
});
export default TrainingHome;
