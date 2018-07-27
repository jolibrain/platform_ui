import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import TrainingCard from "../../widgets/ServiceCardList/Cards/Training";
import ModelRepositoryCard from "../../widgets/ServiceCardList/Cards/ModelRepository";
import RightPanel from "../commons/RightPanel";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    if (!this.props.deepdetectStore.isReady) return null;

    const { metricRepositories } = this.props.modelRepositoriesStore;
    const { trainingServices } = this.props.deepdetectStore;

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <div className="serviceList">
              {trainingServices.length === 0 ? (
                <h4>No training service running</h4>
              ) : (
                <div>
                  <h4>Current Training Service</h4>
                  <div className="card-columns">
                    {trainingServices.map((service, index) => (
                      <TrainingCard key={index} service={service} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <hr />
            <div className="serviceList">
              {metricRepositories.length === 0 ? (
                ""
              ) : (
                <div>
                  <h4>Archive Training Services</h4>
                  <div className="card-columns">
                    {metricRepositories.map((repo, index) => (
                      <ModelRepositoryCard key={index} repository={repo} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
