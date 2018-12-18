import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class Title extends React.Component {
  constructor(props) {
    super(props);
    this.getValue = this.getValue.bind(this);
  }

  getValue(attr) {
    const { service } = this.props;

    let measure, measure_hist;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.measure;
      measure_hist = service.measure_hist;
    }

    let value = null;

    if (measure) {
      value = measure[attr];
    } else if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attr}_hist`][measure_hist[`${attr}_hist`].length - 1];
    }

    return value ? value.toFixed(10) : "--";
  }

  render() {
    const { service } = this.props;

    let measure = null;

    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
    } else {
      measure = service.measure;
    }

    return (
      <div className="title p-4 row">
        <div className="col-md-3">
          <h3>{this.getValue("train_loss")}</h3>
          <h4>Train Loss</h4>
        </div>
        <div className="col-md-3">
          <h3>{measure && measure.iteration ? measure.iteration : "--"}</h3>
          <h4>Iterations</h4>
        </div>
        <div className="col-md-3">
          <h3>
            {measure && measure.iter_time
              ? parseInt(measure.iter_time, 10)
              : "--"}
          </h3>
          <h4>Iteration Time (ms)</h4>
        </div>
        <div className="col-md-3">
          <h3>
            {measure && measure.remain_time_str
              ? measure.remain_time_str
              : "--"}
          </h3>
          <h4>Remaining Time</h4>
        </div>
      </div>
    );
  }
}

Title.propTypes = {
  service: PropTypes.object.isRequired
};
