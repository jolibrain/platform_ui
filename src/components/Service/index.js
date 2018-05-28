import LeftPanel from "./LeftPanel";
import MainView from "./MainView";
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

    this.setCurrentService = this.setCurrentService.bind(this);
  }

  setCurrentService(serviceName = null) {
    if (serviceName === null) {
      this.props.deepdetectStore.setCurrentServiceIndex(0);
    } else {
      this.props.deepdetectStore.setCurrentService(serviceName);
    }
  }

  componentWillMount() {
    const serviceName = this.props.match.params.serviceName;
    this.setCurrentService(serviceName);
  }

  componentWillReceiveProps(props) {
    const serviceName = props.match.params.serviceName;
    this.setCurrentService(serviceName);
  }

  componentWillUpdate(props) {
    const serviceName = props.match.params.serviceName;
    this.setCurrentService(serviceName);
  }

  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-component">
        <LeftPanel />
        <MainView />
      </div>
    );
  }
}
