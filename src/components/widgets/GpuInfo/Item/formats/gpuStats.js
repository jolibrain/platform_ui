import React from "react";
import { observer } from "mobx-react";

@observer
export default class GpuStatsFormat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsVisible: false
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState({ detailsVisible: !this.state.detailsVisible });
  }

  render() {
    const index = this.props.index;
    const gpu = this.props.gpu;

    const memoryMo = parseInt(gpu["memory.used"], 10);
    const memoryTotal = parseInt(gpu["memory.total"], 10);
    //const memoryPercent = parseInt(memoryMo * 100 / gpu['memory.total'], 10);
    const utilPercent = parseInt(gpu["utilization.gpu"], 10);

    let alerts = [];

    let utilPercentDisplay = `${utilPercent}%`;
    if (utilPercent > 70) {
      utilPercentDisplay = <b>{utilPercent}%</b>;
      alerts.push("util");
    }

    let memoryDisplay = memoryMo;
    if (memoryMo / memoryTotal > 0.7) {
      memoryDisplay = <b>{memoryMo}</b>;
      alerts.push("memory");
    }

    return (
      <div key={`gpuInfoItem-${index}`} className="block">
        <div className="row">
          <div className="col-sm-2">
            {alerts.length > 0 ? (
              <span className="badge badge-pill gpu-alert">
                <i className="fas fa-fire" /> {index}
              </span>
            ) : (
              <span className="badge badge-pill">
                <i className="far fa-hdd" /> {index}
              </span>
            )}
          </div>
          <div className="col-sm-2">
            <span className="temp">{gpu["temperature.gpu"]}°C</span>
          </div>
          <div className="col-sm-2 text-right">
            <span className="util">{utilPercentDisplay}</span>
          </div>
          <div className="col-sm-6 text-right">
            <span className="memUsed text-primary">{memoryDisplay}</span> /{" "}
            <span className="memTotal text-secondary">{memoryTotal}</span>
          </div>
        </div>
      </div>
    );
  }
}
