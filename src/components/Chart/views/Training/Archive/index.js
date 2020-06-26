import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../../../commons/RightPanel";

import Title from "../../../../widgets/TrainingMonitor/components/Title";
import GeneralInfo from "../../../../widgets/TrainingMonitor/components/GeneralInfo";
import MeasureHistArray from "../../../../widgets/TrainingMonitor/components/MeasureHistArray";

@inject("modelRepositoriesStore")
@observer
@withRouter
export default class TrainingArchive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repository: null,
      error: null
    };
  }

  async componentWillMount() {
    const { match, modelRepositoriesStore } = this.props;
    const trainingRepositoryStore = modelRepositoriesStore.repositoryStores.find(
      r => r.name === "training"
    );

    try {
      let repository = null;
      let path = match.params.chartParams;

      // Sanitize path
      if (!path.startsWith("/")) path = "/" + path;
      if (!path.endsWith("/")) path = path + "/";

      if (trainingRepositoryStore.repositoryExists(path)) {
        repository = trainingRepositoryStore.repositories.find(
          r => r.path === path
        );
      } else {
        repository = await trainingRepositoryStore.fastLoad(path);
      }

      this.setState({ repository: repository });
    } catch (err) {
      this.setState({
        error: `Error while mounting TrainingArchive chart - ${err}`
      });
    }
  }

  render() {
    const { repository, error } = this.state;

    return (
      <div className="main-view content-wrapper">
        {repository ? (
          <div className="fluid-container">
            <Title service={repository} />
            <div className="content p-4">
              <GeneralInfo services={[repository]} />
              <MeasureHistArray services={[repository]} />
              <RightPanel includeDownloadPanel />
            </div>
          </div>
        ) : (
          <div className="fluid-container">
            <div className="content p-4">
              <p>
                {error ? (
                  <span>
                    <i className="fas fa-exclamation-circle" /> {error}
                  </span>
                ) : (
                  <button type="button" className="btn btn-outline-dark">
                    <i className="fas fa-circle-notch fa-spin" /> loading
                    archive...
                  </button>
                )}
              </p>
            </div>
            <RightPanel />
          </div>
        )}
      </div>
    );
  }
}
