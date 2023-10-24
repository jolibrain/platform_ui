import React from "react";
import { observer } from "mobx-react";

import RightPanel from "./RightPanel";

import stores from "../../stores/rootStore";

const MainView = observer(class MainView extends React.Component {
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
            <h2>Page not found</h2>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
});
export default MainView;
