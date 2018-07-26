import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import React from "react";
import { inject, observer } from "mobx-react";

@inject("configStore")
@observer
export default class TrainingArchive extends React.Component {
  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Training") ||
      this.props.configStore.isComponentBlacklisted("TrainingArchive")
    )
      return null;

    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-show-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
