import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import PredictCard from "./Cards/Predict.js";
import TrainingCard from "./Cards/Training.js";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceCardList extends React.Component {
  _mapServers(server, serverIndex) {
    return server.services.map(
      this._mapServices.bind(this, server, serverIndex)
    );
  }

  _mapServices(server, serverIndex, service, serviceIndex) {
    if (
      (this.props.onlyPredict && service.settings.training) ||
      (this.props.onlyTraining && !service.settings.training)
    )
      return null;

    if (service.settings.training) {
      return (
        <TrainingCard
          key={`${serverIndex}-${serviceIndex}`}
          server={server}
          service={service}
        />
      );
    } else {
      return (
        <PredictCard
          key={`${serverIndex}-${serviceIndex}`}
          server={server}
          service={service}
        />
      );
    }
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceCardList"))
      return null;

    const ddStore = this.props.deepdetectStore;

    return (
      <div className="serviceCardList card-columns">
        {ddStore.servers.map(this._mapServers)}
      </div>
    );
  }
}
