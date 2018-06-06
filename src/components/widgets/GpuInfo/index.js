import React from "react";
import { inject, observer } from "mobx-react";

import GpuInfoItem from "./Item";

@inject("configStore")
@inject("gpuStore")
@observer
export default class GpuInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();
  }

  componentDidMount() {
    const refreshRate = this.props.configStore.gpuInfo.refreshRate;
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    this.props.gpuStore.loadGpuInfo();
  }

  render() {
    const { gpuInfo } = this.props.gpuStore;

    if (gpuInfo == null) return null;

    return (
      <div className="gpuinfo">
        <h5>
          <i className="fas fa-tachometer-alt" /> GPU Monitoring
        </h5>
        {gpuInfo.gpus.map((gpu, index) => (
          <GpuInfoItem key={index} index={index} gpu={gpu} />
        ))}
      </div>
    );
  }
}
