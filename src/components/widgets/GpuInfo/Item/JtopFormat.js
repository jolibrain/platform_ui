import React from "react";
import { observer } from "mobx-react";

@observer
export default class JtopFormat extends React.Component {
  render() {
    const gpuInfo = this.props.gpuInfo;

    if (gpuInfo === null) return null;

    const memoryMo = gpuInfo.RAM.use;
    const memoryTotal = gpuInfo.RAM.tot;

    let alerts = [];

    let memoryDisplay = memoryMo;
    if (memoryMo / memoryTotal > 0.7) {
      memoryDisplay = <b>{memoryMo}</b>;
      alerts.push("memory");
    }

    return (
      <div className="block">
        <div className="row">
          <div className="col-sm-2">
            {alerts.length > 0 ? (
              <span className="badge badge-pill gpu-alert">
                <i className="fas fa-fire" /> 0
              </span>
            ) : (
              <span className="badge badge-pill">
                <i className="far fa-hdd" /> 0
              </span>
            )}
          </div>
          <div className="col-sm-4">
            <span className="temp">{gpuInfo.TEMP.GPU}°C</span>
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
