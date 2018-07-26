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
    const { metricRepositories } = this.props.modelRepositoriesStore;

    const repository = metricRepositories.find(r => r.modelName === modelName);

    if (!repository || !repository.jsonMetrics) return null;

    const { mltype, measure, measure_hist } = repository.jsonMetrics.body;

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
            <TrainingMonitor
              mltype={mltype}
              measure={measure}
              measureHist={measure_hist}
            />
            <RightPanel measure={measure} />
          </div>
        </div>
      </div>
    );
  }
}
