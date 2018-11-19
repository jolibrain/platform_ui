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

    this.state = {
      connector: null
    };

    this.getServiceConnector = this.getServiceConnector.bind(this);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  componentDidMount() {
    this._ismounted = true;
    this.getServiceConnector(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getServiceConnector(nextProps);
  }

  async getServiceConnector(props) {
    const { imaginateStore } = props;

    if (imaginateStore.service) {
      const serviceInfo = await imaginateStore.service.serviceInfo();
      if (
        serviceInfo.body &&
        serviceInfo.body.parameters &&
        serviceInfo.body.parameters.input &&
        serviceInfo.body.parameters.input.length === 1 &&
        serviceInfo.body.parameters.input[0].connector
      ) {
        const connector = serviceInfo.body.parameters.input[0].connector;
        this.setState({ connector: connector });
      }
    }
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("Imaginate")) return null;

    const { imaginateStore } = this.props;

    if (!imaginateStore.service || !this.state.connector) return null;

    let connectorComponent = null;

    switch (this.state.connector) {
      case "txt":
        connectorComponent = <TxtConnector />;
        break;
      case "image":
        connectorComponent = <ImageConnector />;
        break;
      default:
        connectorComponent = (
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-exclamation-circle" />
            Missing attribute <code>body.parameters.input[0].connector</code> in
            Service json.
          </div>
        );
        break;
    }

    return (
      <div
        className={`imaginate-${this.state.connector}`}
        data-servicename={imaginateStore.service.name}
      >
        {connectorComponent}
      </div>
    );
  }
}
