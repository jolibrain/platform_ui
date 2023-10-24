import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

import stores from "../../../stores/rootStore";

const ChainShow = withRouter(observer(class ChainShow extends React.Component {
  constructor(props) {
    super(props);
    this.setDeepdetectServer = this.setDeepdetectServer.bind(this);
  }

  async setDeepdetectServer(params) {
    const { deepdetectStore, imaginateStore } = stores;

    if (!deepdetectStore.isReady) {
      return null;
    } else {
      const chainName = params.chainName;
      const chain = deepdetectStore.chains.find(c => c.name === chainName);

      if (!chain ||
          !chain.content ||
          !chain.content.calls) return null;

      const rootService = chain.content.calls[0].service;

      if (chain.serverPath) {
        deepdetectStore.setServerPath(chain.serverPath);
      }

      // Chain server must be specified in order for services to be called
      // TODO allows other servers to be used in chains
      deepdetectStore.setServerIndex(0);
      // Set root service from chain
      deepdetectStore.setService(rootService);

      imaginateStore.connectToDdStore(deepdetectStore);

      imaginateStore.chain = chain;

      // Run predict in order to refresh currently displayed input
      // this is necessary in order to avoid non-refreshed results
      // when switching from non-chain Predict component
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
    if (configStore.isComponentBlacklisted("Chain")) return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-component chain-show-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
}));
export default ChainShow;
