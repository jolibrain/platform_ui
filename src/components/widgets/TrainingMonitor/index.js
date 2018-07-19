import React from "react";
import { observer, inject } from "mobx-react";

import TrainingAlerts from "./components/TrainingAlerts";
import GeneralInfo from "./components/GeneralInfo";
import PerClassArray from "./components/PerClassArray";

@inject("deepdetectStore")
@inject("configStore")
@observer
export default class TrainingMonitor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();
  }

  componentDidMount() {
    const { settings, server } = this.props.deepdetectStore;

    var intervalId = setInterval(
      this.timer.bind(this),
      settings.refreshRate.training
    );
    this.setState({ intervalId: intervalId });

    server.service.serviceInfo();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    const { server } = this.props.deepdetectStore;
    server.service.fetchTrainMetrics();
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("TrainingMonitor"))
      return null;

    const { server } = this.props.deepdetectStore;

    if (!server.service) return null;

    return (
      <div className="trainingmonitor">
        <GeneralInfo />
        <PerClassArray />
        <TrainingAlerts />
      </div>
    );
  }
}
