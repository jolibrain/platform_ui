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
                  {trainingServices.map((service, index) => (
                    <TrainingCard key={index} service={service} />
                  ))}
                </div>
              )}
            </div>
            <hr />
            <div className="modelList serviceList ServiceCardList card-columns">
              {metricRepositories.length === 0 ? (
                ""
              ) : (
                <div>
                  <h4>Finished Training Services</h4>
                  {metricRepositories.map((repo, index) => {
                    return (
                      <ModelRepositoryCard key={index} repository={repo} />
                    );
                  })}
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
