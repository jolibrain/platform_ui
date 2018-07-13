import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("deepdetectStore")
@inject("imaginateStore")
@withRouter
@observer
export default class PredictShow extends React.Component {
  constructor(props) {
    super(props);

    this.setDeepdetectServer = this.setDeepdetectServer.bind(this);
  }

  setDeepdetectServer(params) {
    const imaginateStore = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (!ddStore.init(params)) {
      this.props.history.push("/404");
    } else if (ddStore.server.currentServiceIndex === -1) {
      this.props.history.push("/");
    } else {
      imaginateStore.connectToDdStore(ddStore);
    }
  }

  componentWillMount() {
    this.setDeepdetectServer(this.props.match.params);
  }

  componentWillReceiveProps(nextProps) {
    this.setDeepdetectServer(nextProps.match.params);
  }

  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-component">
        <LeftPanel />
        <MainView />
        <Modals />
      </div>
    );
  }
}
