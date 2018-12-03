import React from "react";
import { inject, observer } from "mobx-react";

import ImageConnector from "./connectors/Image";
import TxtConnector from "./connectors/Txt";

@inject("imaginateStore")
@inject("configStore")
@observer
export default class Imaginate extends React.Component {
  constructor(props) {
    super(props);

    this.getServiceConnector = this.getServiceConnector.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  getServiceConnector() {
    const { imaginateStore } = this.props;
    let connector = null;

    if (imaginateStore.service) {
      const serviceInfo = imaginateStore.service.respInfo;
      if (
        serviceInfo.body &&
        serviceInfo.body.parameters &&
        serviceInfo.body.parameters.input &&
        serviceInfo.body.parameters.input.length === 1 &&
        serviceInfo.body.parameters.input[0].connector
      ) {
        connector = serviceInfo.body.parameters.input[0].connector;
      }
    }

    return connector;
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("Imaginate")) return null;

    const { imaginateStore } = this.props;

    if (!imaginateStore.service) return null;

    const connector = this.getServiceConnector();
    let connectorComponent = null;

    switch (connector) {
      case "txt":
        connectorComponent = <TxtConnector />;
        break;
      case "image":
        connectorComponent = <ImageConnector />;
        break;
      case "csv":
        connectorComponent = (
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-exclamation-circle" /> CSV connector interface
            not available.
          </div>
        );
        break;
      default:
        connectorComponent = (
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-exclamation-circle" /> Missing attribute{" "}
            <code>body.parameters.input[0].connector</code> in Service json.
          </div>
        );
        break;
    }

    return (
      <div
        className={`imaginate-${connector}`}
        data-servicename={imaginateStore.service.name}
      >
        {connectorComponent}
      </div>
    );
  }
}
