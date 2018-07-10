import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import React from "react";
import store from "store";

export default class Home extends React.Component {
  componentWillMount() {
    store.clearAll();
  }

  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar home-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
