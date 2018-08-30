import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import TrainingMonitor from "../../widgets/TrainingMonitor";
//import Breadcrumb from "../../widgets/Breadcrumb";

@inject("modelRepositoriesStore")
@observer
@withRouter
export default class MainView extends React.Component {
  render() {
    if (
      !this.props.match ||
      !this.props.match.params ||
      !this.props.match.params.modelName
    )
      return null;

    const { modelName } = this.props.match.params;
    const { trainingRepositories } = this.props.modelRepositoriesStore;

    const repository = trainingRepositories.find(r => r.name === modelName);

    if (!repository) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <ul
              className="nav navbar-nav ml-auto"
              style={{ flexDirection: "row" }}
            />
          </nav>
          <div className="content">
            <TrainingMonitor service={repository} />
            <RightPanel service={repository} />
          </div>
        </div>
      </div>
    );
  }
}
