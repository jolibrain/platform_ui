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
    const { trainingServices, predictServices } = deepdetectStore;

    const predictPatt = /^\/predict/g;
    const trainingPatt = /^\/training/g;

    let selectedServices = [];

    let chainItems = deepdetectStore.chains.map((chain, index) => {
      return <ChainItem key={index} chain={chain} />;
    });

    // Test if on predict page
    if (predictPatt.test(match.path)) {
      selectedServices = predictServices;

      // test if on training page
    } else if (trainingPatt.test(match.path)) {
      selectedServices = trainingServices;

      // Disable chainItems on training pages
      chainItems = [];

      // Display all services, usually on frontpage
    } else {
      selectedServices = [...predictServices, ...trainingServices];
    }

    const serviceItems = selectedServices.map((service, index) => {
      return <ServiceItem key={index} service={service} />;
    });

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
