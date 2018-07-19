import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceItem from "./Items/Service.js";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();
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

  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceList"))
      return null;

    const ddStore = this.props.deepdetectStore;

    if (!ddStore.isReady || ddStore.servers.length === 0) return null;

    const services = ddStore.services.filter(service => {
      if (this.props.only) {
        if (this.props.only === "training") {
          return service.settings.training;
        } else {
          return !service.settings.training;
        }
      } else {
        return true;
      }
    });

    return (
      <ul
        className="serviceList sidebar-top-level-items"
        key={`serviceList-${ddStore.refresh}`}
      >
        {services.map((service, index) => {
          return <ServiceItem key={index} service={service} />;
        })}
      </ul>
    );
  }
}
