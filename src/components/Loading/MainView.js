import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";

import stores from "../../stores/rootStore";

const MainView = withRouter(observer(class MainView extends React.Component {
  render() {
    const { configStore, gpuStore } = stores;
    const { homeComponent } = configStore;

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof configStore.gpuInfo !== "undefined" ||
        gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        <div className="container-fluid">
          <div className="content">
            <h2>{homeComponent ? homeComponent.title : ""}</h2>
            <p>{homeComponent ? homeComponent.description : ""}</p>

            <p>
              <button type="button" className="btn btn-outline-dark">
                <i className="fas fa-spinner fa-spin" /> loading...
              </button>
            </p>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}));
export default MainView;
