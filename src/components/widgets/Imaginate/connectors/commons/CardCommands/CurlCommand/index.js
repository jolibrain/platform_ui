import React from "react";
import { withRouter } from "react-router-dom";

import PredictCommand from "./predict";
import ChainCommand from "./chain";

@withRouter
class CurlCommand extends React.Component {
  render() {
    const { path } = this.props.match;
    return path.startsWith("/predict/") ? <PredictCommand /> : <ChainCommand />;
  }
}
export default CurlCommand;
