import React from "react";
import { inject, observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

@inject("configStore")
@inject("deepdetectStore")
@observer
export default class ChartingShow extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = this.props;

    if (!deepdetectStore.isReady) this.props.history.push("/training");

    deepdetectStore.init(this.props.match.params);
    deepdetectStore.setTrainRefreshMode(null);
  }

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Training") ||
      this.props.configStore.isComponentBlacklisted("TrainingCompare")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-compare-component">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
