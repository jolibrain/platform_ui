import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RepositoryCard from "./RepositoryCard";
import RightPanel from "../commons/RightPanel";
import ServiceCardList from "../../widgets/ServiceCardList";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class MainView extends React.Component {
  render() {
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
                  {trainingServices.map(s => s.name)}
                </div>
              )}
            </div>
            <div className="modelList serviceList ServiceCardList card-columns">
              {metricRepositories.map((repo, index) => (
                <RepositoryCard key={index} repository={repo} />
              ))}
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
