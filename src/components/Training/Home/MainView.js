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

    const { trainingServices } = this.props.deepdetectStore;
    const { archivedTrainingRepositories } = this.props.modelRepositoriesStore;

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <div className="serviceList current">
              {trainingServices.length === 0 ? (
                <h4>No training service running</h4>
              ) : (
                <div>
                  <h4>Current Training Services</h4>
                  <ServiceCardList services={trainingServices} />
                </div>
              )}
            </div>
            <hr />
            <div className="serviceList archive">
              <h4>Archived Training Jobs</h4>
              <ServiceCardList services={archivedTrainingRepositories} />
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
