import React from "react";
import { inject, observer } from "mobx-react";

import GpuInfoItem from "./Item";

@inject("configStore")
@inject("gpuStore")
@observer
export default class GpuInfo extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("GpuInfo")) return null;

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
