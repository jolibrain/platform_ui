import React from "react";
import { toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

@inject("deepdetectStore")
@observer
export default class PerClassArray extends React.Component {
  render() {
    const { measure, measureHist } = this.props;

    if (!measure) return null;

    const measureKeys = Object.keys(measure)
      .filter(
        k =>
          k !== "remain_time_str" &&
          k !== "remain_time" &&
          k !== "iter_time" &&
          k !== "iteration" &&
          k !== "train_loss"
      )
      .sort((key1, key2) => {
        if (key1.includes("clacc_") && key2.includes("clacc_")) {
          return (
            parseInt(key1.split("_").pop(), 10) -
            parseInt(key2.split("_").pop(), 10)
          );
        } else {
          return key1 - key2;
        }
      });

    return (
      <div className="row">
        {measureKeys.map((key, index) => {
          let className = "col-md-1";

          let title = key;
          if (title.includes("clacc")) {
            title = title.split("_").pop();
            if (measure[key] > 0) className = "col-md-1 clacc-level-0";

            if (measure[key] > 0.55) className = "col-md-1 clacc-level-warning";

            if (measure[key] > 0.9) className = "col-md-1 clacc-level-success";
          }

          title = title.slice(title.length - 7, title.length);

          return (
            <div key={`measureKey-${key}`} className={className}>
              {measure[key] ? <b>{index + 1}</b> : <span>{index + 1}</span>}
              <br />
              {measure[key] ? measure[key].toFixed(3) : "0"}
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
