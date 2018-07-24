import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import store from "store";
import { inject } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("configStore")
@inject("authStore")
@withRouter
export default class Home extends React.Component {
  componentWillMount() {
    store.clearAll();

    const { match, authStore } = this.props;

    if (match.params && match.params.username) {
      const { username } = match.params;

      if (username === "clean") {
        authStore.user = null;
        authStore.removeStore();
      } else {
        authStore.user = username;
      }
    }
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
