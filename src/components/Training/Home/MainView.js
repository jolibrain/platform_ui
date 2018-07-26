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
    const { servers } = this.props.deepdetectStore;
    const isEmptyTraining = !servers.some(server => {
      return server.services.some(service => service.settings.training);
    });

    const { metricRepositories } = this.props.modelRepositoriesStore;

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <div className="serviceList">
              {isEmptyTraining ? (
                <h4>No training service running</h4>
              ) : (
                <div>
                  <h4>Current Training Service</h4>
                  <ServiceCardList onlyTraining={true} />
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
