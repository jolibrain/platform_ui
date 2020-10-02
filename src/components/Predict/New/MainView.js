import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import Form from "./Form";

@inject("configStore")
@inject("gpuStore")
@withRouter
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
            <Form />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
