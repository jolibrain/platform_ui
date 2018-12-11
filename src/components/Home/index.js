import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import store from "store";
import { inject } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
export default class Home extends React.Component {
  componentWillMount() {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode(null);
    store.clearAll();
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("Home")) return null;

    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar home-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
