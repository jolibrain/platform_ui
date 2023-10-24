import React from "react";
import store from "store";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../Header";
import LeftPanel from "./LeftPanel";
import MainView from "./MainView";

import stores from "../../stores/rootStore";

const Home = withRouter(observer(class Home extends React.Component {
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

  componentDidMount() {
    const { deepdetectStore } = stores;
    deepdetectStore.setTrainRefreshMode(null);
    this.clearAutosaveStorage();
  }

  render() {
    const { configStore } = stores;
    if (configStore.isComponentBlacklisted("Home"))
      return null;

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
}));
export default Home;
