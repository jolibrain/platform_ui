import React from "react";
import { inject, observer } from "mobx-react";

import ImageConnector from "./connectors/Image";
import TxtConnector from "./connectors/Txt";

@inject("imaginateStore")
@inject("deepdetectStore")
@observer
export default class Imaginate extends React.Component {
  constructor(props) {
    super(props);
    this.initStore();
  }

  initStore() {
    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (typeof ddStore.service === "undefined") {
      this.props.history.push("/404");
    }

    store.connectToDeepdetect(ddStore);
  }

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
