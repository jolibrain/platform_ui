import React from "react";
import { inject, observer } from "mobx-react";

import GpuStatServer from "./Server";

@inject("configStore")
@inject("gpuStore")
@observer
export default class GpuInfo extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("GpuInfo")) return null;

    const { servers } = this.props.gpuStore;

    return (
      <div className="gpuinfo">
        {servers.map((s, i) => {
          return <GpuStatServer key={i} server={s} />;
        })}
      </div>
    );
  }
}
