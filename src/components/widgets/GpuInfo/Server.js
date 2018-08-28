import React from "react";

import GpuInfoItem from "./Item";

export default class GpuStatServer extends React.Component {
  render() {
    const { server } = this.props;

    let serverInfo = "Server information not available";

    if (
      server.gpuInfo &&
      server.gpuInfo.gpus &&
      server.gpuInfo.gpus.length > 0
    ) {
      serverInfo = server.gpuInfo.gpus.map((gpu, index) => {
        return <GpuInfoItem key={index} index={index} gpu={gpu} />;
      });
    }

    return (
      <div className="gpuinfo">
        <h5>
          <i className="fas fa-tachometer-alt" /> {server.name}
        </h5>
        {serverInfo}
      </div>
    );
  }
}
