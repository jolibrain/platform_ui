import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import ServiceCardList from "../../widgets/ServiceCardList";

@inject("deepdetectStore")
@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    const ddStore = this.props.deepdetectStore;
    const isEmpty = !ddStore.servers.some(server => {
      return server.services.some(service => service.settings.training);
    });

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <div className="serviceList">
              {isEmpty ? (
                <h4>No training service running</h4>
              ) : (
                <div>
                  <h4>Current Training Service</h4>
                  <ServiceCardList onlyTraining={true} />
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
