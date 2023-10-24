import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

import stores from "../../../stores/rootStore";

const PredictShow = withRouter(observer(class PredictShow extends React.Component {
  constructor(props) {
    super(props);

    this.setDeepdetectServer = this.setDeepdetectServer.bind(this);
  }

  async setDeepdetectServer(params) {
    const { deepdetectStore, imaginateStore } = stores;

    if (!deepdetectStore.isReady) {
      this.props.history.push("/predict");
    } else if (!deepdetectStore.init(params)) {
      this.props.history.push("/404");
    } else {
      imaginateStore.connectToDdStore(deepdetectStore);

      // Remove chain setup from imaginateStore and
      // run predict in order to refresh currently displayed input
      //
      // this is necessary in order to avoid non-refreshed results
      // when switching from non-chain Predict component
      imaginateStore.chain = {};
      imaginateStore.predict();
    }

    deepdetectStore.setTrainRefreshMode(null);
  }

  componentWillMount() {
    this.setDeepdetectServer(this.props.match.params);
  }

  componentWillReceiveProps(nextProps) {
    this.setDeepdetectServer(nextProps.match.params);
  }

  render() {
    const { configStore } = stores;
    if (
      configStore.isComponentBlacklisted("Predict") ||
      configStore.isComponentBlacklisted("PredictShow")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-component predict-show-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
}));
export default PredictShow;
