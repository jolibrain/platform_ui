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
      connector: null,
      isMounted: false
    };

    this.getServiceConnector = this.getServiceConnector.bind(this);
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    this.getServiceConnector(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.state.isMounted) {
      this.getServiceConnector(nextProps);
    }
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

    if (!imaginateStore.service) return null;

    let connectorComponent = null;

    switch (this.state.connector) {
      case "txt":
        connectorComponent = <TxtConnector />;
        break;
      case "image":
        connectorComponent = <ImageConnector />;
        break;
      default:
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
