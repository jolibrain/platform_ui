import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import TrainingMonitor from "../../widgets/TrainingMonitor";
import Breadcrumb from "../../widgets/Breadcrumb";

@inject("modelRepositoriesStore")
@observer
@withRouter
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredMeasure: -1
    };

    this.handleOverMeasure = this.handleOverMeasure.bind(this);
    this.handleLeaveMeasure = this.handleLeaveMeasure.bind(this);
  }

  componentWillMount() {
    const { modelRepositoriesStore } = this.props;
    if (!modelRepositoriesStore.isReady) {
      modelRepositoriesStore.refresh();
    }
  }

  handleOverMeasure(index) {
    this.setState({ hoveredMeasure: index });
  }

  handleLeaveMeasure(index) {
    this.setState({ hoveredMeasure: -1 });
  }

  render() {
    if (
      !this.props.match ||
      !this.props.match.params ||
      !this.props.match.params.modelPath
    )
      return null;

    const { modelPath } = this.props.match.params;
    const { trainingRepositories } = this.props.modelRepositoriesStore;

    const repository = trainingRepositories.find(
      r => r.path === `/${modelPath}/`
    );

    if (!repository) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container">
          <Breadcrumb repository={repository} />
          <div className="content">
            <TrainingMonitor
              service={repository}
              handleOverMeasure={this.handleOverMeasure}
              handleLeaveMeasure={this.handleLeaveMeasure}
              hoveredMeasure={this.state.hoveredMeasure}
            />
            <RightPanel
              service={repository}
              handleOverMeasure={this.handleOverMeasure}
              handleLeaveMeasure={this.handleLeaveMeasure}
              hoveredMeasure={this.state.hoveredMeasure}
              includeDownloadPanel
            />
          </div>
        </div>
      </div>
    );
  }
}
