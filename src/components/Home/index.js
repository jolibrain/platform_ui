import React from "react";
import store from "store";
import { inject } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../Header";
import LeftPanel from "./LeftPanel";
import MainView from "./MainView";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.clearAutosaveStorage = this.clearAutosaveStorage.bind(this);
  }

  clearAutosaveStorage() {
    store.each(function(value, key) {
      if (key.includes("autosave_service_")) {
        store.remove(key);
      }
    });
  }

  componentWillMount() {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode(null);
    this.clearAutosaveStorage();
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("Home")) return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar home-component">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
export default Home;
