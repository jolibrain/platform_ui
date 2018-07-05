import React from "react";
import { observer, inject } from "mobx-react";

@inject("deepdetectStore")
@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const measures = service.trainMeasure;

    if (!measures) return null;

    const claccKeys = Object.keys(measures).filter(
      key => key.indexOf("clacc_") > -1
    );

    return (
      <div className="row">
        {claccKeys
          .sort((a, b) => {
            return (
              parseInt(a.split("_").pop(), 10) -
              parseInt(b.split("_").pop(), 10)
            );
          })
          .map((key, index) => {
            let className = "col-md-1";

            if (measures[key] > 0) className = "col-md-1 clacc-level-0";

            if (measures[key] > 0.55)
              className = "col-md-1 clacc-level-warning";

            if (measures[key] > 0.9) className = "col-md-1 clacc-level-success";

            const title = key.split("_").pop();

            return (
              <div key={`clacc-${key}`} className={className}>
                {measures[key] > 0 ? <b>#{title}</b> : <span>#{title}</span>}
                <br />
                {measures[key] > 0 ? measures[key].toFixed(3) : "--"}
              </div>
            );
          })}
      </div>
    );
  }
}
