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

    const { deepdetectStore } = this.props;

    const serviceItems = deepdetectStore.services.map((service, index) => {
      return <ServiceItem key={index} service={service} />;
    });

    const chainItems = deepdetectStore.chains.map((chain, index) => {
      return <ChainItem key={index} chain={chain} />;
    });

    return (
      <ul
        id="widget-serviceList"
        className="serviceList sidebar-top-level-items"
      >
        {serviceItems}
        {chainItems.length > 0 ? <hr /> : null}
        {chainItems}
      </ul>
    );
  }
}
