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

    return value ? parseFloat(value) : "--";
  }

  render() {
    const { service } = this.props;

    let measure = null;

    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
    } else {
      measure = service.measure;
    }

    let infoColumns = [];

    let trainLossValue = this.getValue("train_loss");

    if (typeof trainLossValue.toFixed === "function") {
      if (trainLossValue > 1) {
        trainLossValue = trainLossValue.toFixed(3);
      } else {
        // Find position of first number after the comma
        const zeroPosition = trainLossValue
          .toString()
          .split("0")
          .slice(2)
          .findIndex(elem => elem.length > 0);

        trainLossValue = trainLossValue.toFixed(zeroPosition + 4);
      }
    }

    infoColumns.push({
      value: trainLossValue,
      title: "Train Loss"
    });

    infoColumns.push({
      value: measure && measure.iteration ? measure.iteration : "--",
      title: "Iterations"
    });

    if (service.isRepository && service.bestModel) {
      Object.keys(service.bestModel).forEach((key, index) => {
        let title =
          index === 0
            ? key.replace(/\b\w/g, l => l.toUpperCase())
            : key.toUpperCase();

        infoColumns.push({
          value: service.bestModel[key],
          title: title,
          isBest: true
        });
      });
    } else {
      infoColumns.push({
        value:
          measure && measure.iter_time ? parseInt(measure.iter_time, 10) : "--",
        title: "Iteration Time (ms)"
      });
      infoColumns.push({
        value:
          measure && measure.remain_time_str ? measure.remain_time_str : "--",
        title: "Remaining Time"
      });

      if (service.bestModel) {
        const bestModelKey = Object.keys(service.bestModel).find(
          k => k !== "iteration"
        );
        if (bestModelKey && bestModelKey.length > 0) {
          infoColumns.push({
            value: service.bestModel[bestModelKey],
            title: bestModelKey.toLocaleUpperCase(),
            isBest: true
          });
        }

        if (service.bestModel.iteration) {
          infoColumns.push({
            value: service.bestModel.iteration,
            title: "Iterations",
            isBest: true
          });
        }
      }
    }

    return (
      <div className="title p-4 row">
        {infoColumns.map((col, index) => {
          return (
            <div key={`info-${index}`} className="col-lg-3 col-md-6">
              <h3>{col.value}</h3>
              {col.isBest ? <h4>{col.title} - best</h4> : <h4>{col.title}</h4>}
            </div>
          );
        })}
      </div>
    );
  }
}

Title.propTypes = {
  service: PropTypes.object.isRequired
};
