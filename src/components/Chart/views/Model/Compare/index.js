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
export default class ModelCompare extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repositories: [],
      error: null
    };
  }

  async componentWillMount() {
    const { match, modelRepositoriesStore } = this.props;
    const trainingRepositoryStore = modelRepositoriesStore.repositoryStores.find(
      r => r.name === "training"
    );

    try {
      let repositories = [];
      let paths = match.params.chartParams.split("+");
      console.log(paths);

      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let repository = null;

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

        if (repository) repositories.push(repository);
      }

      this.setState({ repositories: repositories });
    } catch (err) {
      this.setState({
        error: `Error while mounting ModelCompare chart - ${err}`
      });
    }
  }

  render() {
    const { repositories, error } = this.state;

    return (
      <div className="main-view content-wrapper">
        {repositories.length > 0 ? (
          <div className="fluid-container">
            {repositories.map(repository => {
              return (
                <div key={repository.path}>
                  <Title service={repository} />
                  <div className="content p-4">
                    <GeneralInfo service={repository} />
                    <MeasureHistArray service={repository} />
                    <RightPanel includeDownloadPanel />
                  </div>
                </div>
              );
            })}
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
