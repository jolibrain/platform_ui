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
    if (this._isMounted) this.getServiceConnector(nextProps);
  }

  async getServiceConnector(props) {
    const store = props.imaginateStore;

    if (store.service) {
      const serviceInfo = await store.service.serviceInfo();
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

    const store = this.props.imaginateStore;

    if (!store.service || !this.state.connector) return null;

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

    return (
      <div className={`imaginate-${this.state.connector}`}>{connector}</div>
    );
  }
}
