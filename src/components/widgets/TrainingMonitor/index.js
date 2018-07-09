import React from "react";
import { observer, inject } from "mobx-react";

import TrainingAlerts from "./components/TrainingAlerts";
import GeneralInfo from "./components/GeneralInfo";
import PerClassArray from "./components/PerClassArray";

@inject("deepdetectStore")
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
    const { settings, service } = this.props.deepdetectStore;

    var intervalId = setInterval(
      this.timer.bind(this),
      settings.infoRefreshRate
    );
    this.setState({ intervalId: intervalId });

    service.serviceInfo();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    const { service } = this.props.deepdetectStore;
    service.fetchTrainMetrics();
  }

  render() {
    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    return (
      <div className="trainingmonitor">
        <GeneralInfo />
        <PerClassArray />
        <TrainingAlerts />{" "}
      </div>
    );
  }
}
