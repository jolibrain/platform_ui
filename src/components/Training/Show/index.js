import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class TrainingShow extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = this.props;

    if (!deepdetectStore.isReady) this.props.history.push("/training");

    deepdetectStore.init(this.props.match.params);
    deepdetectStore.setTrainRefreshMode("service");
  }

  componentWillReceiveProps(nextProps) {
    const { deepdetectStore } = this.props;
    deepdetectStore.init(nextProps.match.params);
    deepdetectStore.setTrainRefreshMode("service");
  }

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Training") ||
      this.props.configStore.isComponentBlacklisted("TrainingShow")
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
}
