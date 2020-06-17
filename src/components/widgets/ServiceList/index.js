import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceItem from "./Items/Service.js";
import ChainItem from "./Items/Chain.js";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceList extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceList"))
      return null;

    const { deepdetectStore, match } = this.props;

    const predictPatt = /^\/predict/g;
    const trainingPatt = /^\/training/g;

    const serviceItems = deepdetectStore.services
      .filter((service, index) => {
        // Select training services on training page,
        // and predict services on predict page
        return (
          (trainingPatt.test(match.path) && service.settings.training) ||
          (predictPatt.test(match.path) && !service.settings.training)
        );
      })
      .map((service, index) => {
        return <ServiceItem key={index} service={service} />;
      });

    // Show chain items only on predict page
    let chainItems = [];
    if (predictPatt.test(match.path)) {
      chainItems = deepdetectStore.chains.map((chain, index) => {
        return <ChainItem key={index} chain={chain} />;
      });
    }

    return (
      <ul
        id="widget-serviceList"
        className="serviceList sidebar-top-level-items"
      >
        {serviceItems}
        {serviceItems.length > 0 && chainItems.length > 0 ? <hr /> : null}
        {chainItems}
      </ul>
    );
  }
}
