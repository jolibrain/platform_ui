import React from "react";
import { inject, observer } from "mobx-react";

import ImageConnector from "./connectors/Image";
import TxtConnector from "./connectors/Txt";

@inject("imaginateStore")
@observer
export default class Imaginate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connector: null
    };

    this.getServiceConnector = this.getServiceConnector.bind(this);
  }

  componentDidMount() {
    this.getServiceConnector();
  }

  async getServiceConnector() {
    const store = this.props.imaginateStore;
    const serviceInfo = await store.service.serviceInfo();
    if (serviceInfo.body) {
      console.log(serviceInfo.body.parameters.input.connector);
      this.setState({ connector: serviceInfo.body.parameters.input.connector });
    }
  }

  render() {
    const store = this.props.imaginateStore;

    if (!store.isLoaded || !store.service || this.state.connector) return null;

    let connector = null;

    switch (this.state.connector) {
      case "txt":
        connector = <TxtConnector />;
        break;
      default:
      case "image":
        connector = <ImageConnector />;
        break;
    }

    return connector;
  }
}
