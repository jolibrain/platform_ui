import React from "react";
import { observer } from "mobx-react";

import GpuStatsFormat from "./Item/GpuStatsFormat";
import JtopFormat from "./Item/JtopFormat";

@observer
export default class GpuStatServer extends React.Component {
  render() {
    const { server } = this.props;

    let serverInfo = "Server information not available";

    if (server.isAvailable) {
      switch (server.type) {
        case "jetson":
          serverInfo = <JtopFormat gpuInfo={server.gpuInfo} />;
          break;
        default:
          serverInfo = server.gpuInfo.gpus.map((gpu, index) => {
            return <GpuStatsFormat key={index} index={index} gpu={gpu} />;
          });
      }
    }

    return (
      <div className="gpuinfo">
        <h5>
          <i className="fas fa-server" /> {server.name}
        </h5>
        {serverInfo}
      </div>
    );
  }
}
