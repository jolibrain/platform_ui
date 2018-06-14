import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("commonStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class Service extends React.Component {
  constructor(props) {
    super(props);

    this.setDeepdetectServer = this.setDeepdetectServer.bind(this);
  }

  setDeepdetectServer(params) {
    const ddStore = this.props.deepdetectStore;
    ddStore.setServer(params.serverName);
    ddStore.setService(params.serviceName);
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
