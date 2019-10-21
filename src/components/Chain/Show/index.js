import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

@inject("deepdetectStore")
@inject("imaginateStore")
@inject("configStore")
@withRouter
@observer
export default class ChainShow extends React.Component {
  constructor(props) {
    super(props);
    this.setDeepdetectServer = this.setDeepdetectServer.bind(this);
  }

  async setDeepdetectServer(params) {
    const { deepdetectStore, imaginateStore } = this.props;

    if (!deepdetectStore.isReady) {
      return null;
    } else {
      const chainName = params.chainName;
      const chain = deepdetectStore.chains.find(c => c.name === chainName);

      if (typeof chain.calls === "undefined") return null;

      const rootService = chain.calls[0].service;

      deepdetectStore.setService(rootService);
      imaginateStore.connectToDdStore(deepdetectStore);

      imaginateStore.chainCalls = chain.calls;
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
    if (this.props.configStore.isComponentBlacklisted("Chain")) return null;

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
}
