import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceItem from "./Items/Service.js";
import ChainItem from "./Items/Chain.js";

import stores from "../../../stores/rootStore";

const ServiceList = withRouter(observer(class ServiceList extends React.Component {
  render() {
    const { configStore, deepdetectStore } = stores;
    const { match } = this.props;
    if (configStore.isComponentBlacklisted("ServiceList"))
      return null;

    const { trainingServices, predictServices } = deepdetectStore;

    const predictPatt = /^\/predict/g;
    const trainingPatt = /^\/training/g;

    let selectedServices = [];

    let chainItems = deepdetectStore.chains.map((chain, index) => {
      return <ChainItem key={index} chain={chain} />;
    });

    // Flag to enable/disable section filter
    //
    // when set to true, it displays predict services on /predict page
    // and training services on /training page
    //
    // when set to false, it displays all services on all pages
    //
    const enableSectionFilter = false;

    // Test if on predict page
    if (enableSectionFilter && predictPatt.test(match.path)) {
      selectedServices = predictServices;

      // test if on training page
    } else if (enableSectionFilter && trainingPatt.test(match.path)) {
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
}));
export default ServiceList;
