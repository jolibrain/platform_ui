import React from "react";
import { observer } from "mobx-react";

import GpuStatsFormat from "./Item/GpuStatsFormat";
import JtopFormat from "./Item/JtopFormat";

@observer
export default class GpuStatServer extends React.Component {
  render() {
    const { server } = this.props;

    let serverInfo = "Server information not available";
    let classNames = "fas fa-server";

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

    let externalLink;
    if (server.externalLink) {
      externalLink = (
        <span className="externalLink">
          <a href={server.externalLink} target="_blank" rel="noopener">
            <i className="fas fa-external-link-alt" />
          </a>
        </span>
      );
    }

    return (
      <div className="gpuinfo">
        <h5>
          <i className={classNames} /> {server.name} {externalLink}
        </h5>
        {serverInfo}
      </div>
    );
  }
}
