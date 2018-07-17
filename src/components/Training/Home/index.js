import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject } from "mobx-react";

@inject("configStore")
export default class TrainingHome extends React.Component {
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
