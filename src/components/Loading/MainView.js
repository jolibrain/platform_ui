import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";

@inject("configStore")
@inject("gpuStore")
@withRouter
@observer
class MainView extends React.Component {
  render() {
    const { homeComponent } = this.props.configStore;

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof this.props.configStore.gpuInfo !== "undefined" ||
        this.props.gpuStore.servers.length > 0
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
}
export default MainView;
