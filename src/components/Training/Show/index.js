import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("configStore")
@withRouter
@observer
export default class TrainingShow extends React.Component {
  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Training") ||
      this.props.configStore.isComponentBlacklisted("TrainingShow")
    )
      return null;

    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-show-component">
        <LeftPanel />
        <MainView />
        <Modals />
      </div>
    );
  }
}
