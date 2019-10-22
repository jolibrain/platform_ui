import React from "react";
import { inject, observer } from "mobx-react";

import PredictCommand from "./predict";
import ChainCommand from "./chain";

@inject("imaginateStore")
@observer
export default class CurlCommand extends React.Component {
  render() {
    const { service } = this.props.imaginateStore;

    if (service.selectedInput === null) return null;

    const { json } = service.selectedInput;

    if (!json) return null;

    const isChainResult =
      json.head && json.head.method && json.head.method === "/chain";

    return isChainResult ? <ChainCommand /> : <PredictCommand />;
  }
}
