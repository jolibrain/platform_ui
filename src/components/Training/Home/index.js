import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject } from "mobx-react";

@inject("deepdetectStore")
@inject("configStore")
export default class TrainingHome extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode("services");
  }

  componentWillReceiveProps(nextProps) {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode("services");
  }

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Training") ||
      this.props.configStore.isComponentBlacklisted("TrainingHome")
    )
      return null;

    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-home-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
