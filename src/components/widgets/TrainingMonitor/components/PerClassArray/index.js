import React from "react";
import PropTypes from "prop-types";

import { toJS } from "mobx";
import { observer } from "mobx-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props;

    let measure, measure_hist;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.measure;
      measure_hist = service.measure_hist;
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
        k !== "cmdiag"
    );

    return (
      <div className="row" refresh={service.refresh}>
        {measureKeys.map((key, index) => {
          let classNames = ["col-md-1", "measure-cell"];

          if (this.props.hoveredMeasure === index) classNames.push("hovered");
          let value = "--";
          try {
            value = measure[key].toFixed(5);
          } catch (e) {
            // measure[key].toFixed is not a function
          }

          let measureHistIndex = `${key}_hist`;
          let sparkData = [];

          // display color levels for clacc
          if (key.includes("clacc")) {
            if (value > 0) classNames.push("clacc-level-0");
            if (value > 0.55) classNames.push("clacc-level-warning");
            if (value > 0.9) classNames.push("clacc-level-success");
          }

          if (
            measure_hist &&
            measure_hist[measureHistIndex] &&
            measure_hist[measureHistIndex].length > 0
          ) {
            sparkData = toJS(measure_hist[measureHistIndex]).map(x =>
              parseInt(x * 100, 10)
            );
          }

          return (
            <div
              key={`measureKey-${key}`}
              className={classNames.join(" ")}
              onMouseEnter={this.props.handleOverMeasure.bind(this, index)}
            >
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
  service: PropTypes.object.isRequired,
  handleOverMeasure: PropTypes.func,
  hoveredMeasure: PropTypes.number
};
