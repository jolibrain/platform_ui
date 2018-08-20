import React from "react";
import PropTypes from "prop-types";

import { toJS } from "mobx";
import { observer } from "mobx-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props;

    let measure,
      measure_hist = null;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.respTraining.body.measure;
      measure_hist = service.respTraining.body.measure_hist;
    }

    if (!measure) return null;

    const measureKeys = Object.keys(measure).filter(
      k =>
        k !== "remain_time_str" &&
        k !== "remain_time" &&
        k !== "iter_time" &&
        k !== "iteration" &&
        k !== "train_loss" &&
        k !== "labels" &&
        k !== "cmfull" &&
        k !== "cmdiag" &&
        k !== "clacc"
    );

    if (measure["clacc"] && measure["clacc"].length > 0) {
      for (let i = 0; i < measure["clacc"].length; i++) {
        measureKeys.push(`clacc_${i}`);
      }
    }

    return (
      <div className="row" refresh={service.refresh}>
        {measureKeys.map((key, index) => {
          let className = "col-md-1";
          let title = key;
          let value = 0;
          let sparkData = [];
          let measureHistIndex = null;

          // Special processing for clacc
          // that contains an array of values
          if (title.includes("clacc")) {
            const claccIndex = title.split("_").pop();
            value = measure["clacc"][claccIndex].toFixed(3);
            measureHistIndex = `clacc_${claccIndex}_hist`;

            if (value > 0) className = "col-md-1 clacc-level-0";
            if (value > 0.55) className = "col-md-1 clacc-level-warning";
            if (value > 0.9) className = "col-md-1 clacc-level-success";
          } else if (measure[key]) {
            value = measure[key].toFixed(3);
            measureHistIndex = `${key}_hist`;
          }

          // Build sparkline data using measureHistIndex
          // which could vary depending if using clacc
          if (
            measureHistIndex &&
            measure_hist &&
            measure_hist[measureHistIndex] &&
            measure_hist[measureHistIndex].length > 0
          ) {
            sparkData = toJS(measure_hist[measureHistIndex]).map(x =>
              parseInt(x * 100, 10)
            );
          }

          title = title.slice(title.length - 7, title.length);

          return (
            <div key={`measureKey-${key}`} className={className}>
              {value !== 0 ? <b>{index + 1}</b> : <span>{index + 1}</span>}
              <br />
              {value}
              <br />
              <Sparklines data={sparkData} min={0} max={100}>
                <SparklinesLine color="black" />
              </Sparklines>
            </div>
          );
        })}
      </div>
    );
  }
}

PerClassArray.propTypes = {
  service: PropTypes.object.isRequired
};
