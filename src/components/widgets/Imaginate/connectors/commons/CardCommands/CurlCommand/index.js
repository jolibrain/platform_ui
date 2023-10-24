import React from "react";
import { withRouter } from "react-router-dom";

import PredictCommand from "./predict";
import ChainCommand from "./chain";

const CurlCommand = withRouter(class CurlCommand extends React.Component {
  render() {
    const { match } = this.props;
    const { path } = match;
    return path.startsWith("/predict/") ? <PredictCommand /> : <ChainCommand />;
  }
});
export default CurlCommand;
