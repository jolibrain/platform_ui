import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import TrainingMonitor from "../../widgets/TrainingMonitor";
import Title from "../../widgets/TrainingMonitor/components/Title";
import Breadcrumb from "../../widgets/Breadcrumb";

@inject("modelRepositoriesStore")
@observer
@withRouter
export default class MainView extends React.Component {
  componentWillMount() {
    const { modelRepositoriesStore } = this.props;
    if (!modelRepositoriesStore.isReady) {
      modelRepositoriesStore.refresh();
    }
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
        <div className="fluid-container">
          <Title service={repository} />
          <div className="training-breadcrumb px-4 py-2">
            <Breadcrumb repository={repository} />
          </div>
          <div className="content p-4">
            <TrainingMonitor service={repository} />
            <RightPanel includeDownloadPanel />
          </div>
        </div>
      </div>
    );
  }
}
