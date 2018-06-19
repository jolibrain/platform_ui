import React from "react";
import { inject, observer } from "mobx-react";

import ImageConnector from "./connectors/Image";
import TxtConnector from "./connectors/Txt";

@inject("imaginateStore")
@observer
export default class Imaginate extends React.Component {
  render() {
    const store = this.props.imaginateStore;

    if (!store.isLoaded || !store.service) return null;

    let connector = null;

    switch (store.service.name) {
      case "text":
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
