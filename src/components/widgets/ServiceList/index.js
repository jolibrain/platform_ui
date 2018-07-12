import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceItem from "./Items/Service.js";

@inject("deepdetectStore")
@withRouter
@observer
export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();

    this._mapServers = this._mapServers.bind(this);
    this._mapServices = this._mapServices.bind(this);
  }

  componentDidMount() {
    const refreshRate = this.props.deepdetectStore.settings.refreshRate.info;
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    this.props.deepdetectStore.loadServices(true);
  }

  _mapServers(server, serverIndex) {
    return server.services
      .filter(service => {
        if (this.props.only) {
          if (this.props.only === "training") {
            return service.settings.training;
          } else {
            return !service.settings.training;
          }
        } else {
          return true;
        }
      })
      .map(this._mapServices.bind(this, server, serverIndex));
  }

  _mapServices(server, serverIndex, service, serviceIndex) {
    return (
      <ServiceItem
        key={`service-item-${serverIndex}-${serviceIndex}`}
        server={server}
        serverIndex={serverIndex}
        service={service}
        serviceIndex={serviceIndex}
      />
    );
  }

  render() {
    const ddStore = this.props.deepdetectStore;

    if (!ddStore.isReady || ddStore.servers.length === 0) return null;

    return (
      <ul
        className="serviceList sidebar-top-level-items"
        key={`serviceList-${ddStore.refresh}`}
      >
        {ddStore.servers.map(this._mapServers)}
      </ul>
    );
  }
}
