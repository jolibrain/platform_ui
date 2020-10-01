import React from "react";
import { inject, observer } from "mobx-react";

import RightPanel from "./RightPanel";

@inject("configstore")
@inject("gpustore")
@observer
class MainView extends React.Component {
  render() {
    let mainClassnames = "main-view content-wrapper"
    if (
      typeof this.props.configStore.gpuInfo !== "undefined" &&
        this.props.gpuStore.servers.length > 0
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
}
export default MainView;
