import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import Form from "./Form";

import stores from "../../../stores/rootStore";

const MainView = withRouter(observer(class MainView extends React.Component {
  render() {
    const { configStore, gpuStore } = stores;

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof configStore.gpuInfo !== "undefined" &&
        gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        <div className="container-fluid">
          <div className="content">
            <Form />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}));
export default MainView;
