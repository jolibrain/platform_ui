import React from "react";
import { observer } from "mobx-react";

import GpuStatsFormat from "./formats/gpuStats";
import JtopFormat from "./formats/jtop";

@observer
export default class GpuInfoItem extends React.Component {
  render() {
    const gpu = this.props.gpu;

    if (gpu.type && gpu.type === "jetson") {
      return <JtopFormat gpu={gpu} />;
    } else {
      return <GpuStatsFormat gpu={gpu} />;
    }
  }
}
