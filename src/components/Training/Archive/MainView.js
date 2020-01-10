import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import Title from "../../widgets/TrainingMonitor/components/Title";
import GeneralInfo from "../../widgets/TrainingMonitor/components/GeneralInfo";
import MeasureHistArray from "../../widgets/TrainingMonitor/components/MeasureHistArray";

@inject("modelRepositoriesStore")
@observer
@withRouter
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { repository: null };
  }

  async componentWillMount() {
    const { match, modelRepositoriesStore } = this.props;
    const trainingRepositoryStore = modelRepositoriesStore.repositoryStores.find(
      r => r.name === "training"
    );

    // When using direct url, the training store will need to be refreshed
    if (!trainingRepositoryStore.isReady) {
      await trainingRepositoryStore.load();
    }

    if (match && match.params && match.params.modelPath) {
      const repository = trainingRepositoryStore.repositories.find(r => {
        return r.path === `/${match.params.modelPath}/`;
      });

      this.setState({ repository: repository });
    }
  }

  render() {
    const { repository } = this.state;

    return (
      <div className="main-view content-wrapper">
        {repository ? (
          <div className="fluid-container">
            <Title service={repository} />
            <div className="content p-4">
              <GeneralInfo service={repository} />
              <MeasureHistArray service={repository} />
              <RightPanel includeDownloadPanel />
            </div>
          </div>
        ) : (
          <div className="fluid-container">
            <div className="content p-4">
              <p>
                <button type="button" className="btn btn-outline-dark">
                  <i className="fas fa-circle-notch fa-spin" /> loading
                  archive...
                </button>
              </p>
            </div>
            <RightPanel />
          </div>
        )}
      </div>
    );
  }
}
