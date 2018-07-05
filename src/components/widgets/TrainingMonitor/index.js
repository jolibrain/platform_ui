import React from "react";
import { observer, inject } from "mobx-react";

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
    const refreshRate = this.props.deepdetectStore.settings.infoRefreshRate;
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({ intervalId: intervalId });
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
      </div>
    );
  }
}
