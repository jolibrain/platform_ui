import React from "react";
import { toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

@inject("deepdetectStore")
@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const measure = service.trainMeasure;
    const measureHist = service.trainMeasureHist;

    if (!measure) return null;

    const claccKeys = Object.keys(measure).filter(key =>
      key.includes("clacc_")
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

            if (measure[key] > 0) className = "col-md-1 clacc-level-0";

            if (measure[key] > 0.55) className = "col-md-1 clacc-level-warning";

            if (measure[key] > 0.9) className = "col-md-1 clacc-level-success";

            const title = key.split("_").pop();

            return (
              <div key={`clacc-${key}`} className={className}>
                {measure[key] > 0 ? <b>#{title}</b> : <span>#{title}</span>}
                <br />
                {measure[key] > 0 ? measure[key].toFixed(3) : "--"}
                <br />
                {measureHist &&
                measureHist[`${key}_hist`] &&
                measureHist[`${key}_hist`].length > 0 ? (
                  <Sparklines
                    data={toJS(measureHist[`${key}_hist`]).map(x =>
                      parseInt(x * 100, 10)
                    )}
                    min={0}
                    max={100}
                  >
                    <SparklinesLine color="black" />
                  </Sparklines>
                ) : (
                  ""
                )}
              </div>
            );
          })}
      </div>
    );
  }
}
