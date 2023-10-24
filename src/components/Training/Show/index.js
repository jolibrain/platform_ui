import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

import stores from "../../../stores/rootStore";

const TrainingShow = withRouter(observer(class TrainingShow extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = stores;

    if (!deepdetectStore.isReady) this.props.history.push("/training");

    deepdetectStore.init(this.props.match.params);
    deepdetectStore.setTrainRefreshMode("service");
  }

  componentWillReceiveProps(nextProps) {
    const { deepdetectStore } = stores;
    deepdetectStore.init(nextProps.match.params);
    deepdetectStore.setTrainRefreshMode("service");
  }

  render() {
    const { configStore } = stores;
    if (
      configStore.isComponentBlacklisted("Training") ||
      configStore.isComponentBlacklisted("TrainingShow")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-show-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
}));
export default TrainingShow;
