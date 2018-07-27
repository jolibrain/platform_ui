import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceCardList from "../../widgets/ServiceCardList";
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
                  <ServiceCardList services={trainingServices} />
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
                  <ServiceCardList services={metricRepositories} />
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
