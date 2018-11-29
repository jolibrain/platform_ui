import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceItem from "./Items/Service.js";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceList extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceList"))
      return null;

    const { deepdetectStore } = this.props;

    if (deepdetectStore.servers.length === 0) return null;

    const services = deepdetectStore.services.filter(service => {
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

    const serviceItems = services
      .sort((a, b) => {
        // Sort by name
        var nameA = a.settings.name.toUpperCase();
        var nameB = b.settings.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      })
      .map((service, index) => {
        return <ServiceItem key={index} service={service} />;
      });

    return (
      <ul
        id="widget-serviceList"
        className="serviceList sidebar-top-level-items"
        key={`serviceList-${deepdetectStore.refresh}`}
      >
        {serviceItems}
      </ul>
    );
  }
}
