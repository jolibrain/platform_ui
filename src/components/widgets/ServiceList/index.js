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

    const serviceItems = deepdetectStore.services
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
      >
        {serviceItems}
      </ul>
    );
  }
}
