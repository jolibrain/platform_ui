import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("configStore")
@observer
export default class TrainingMeasure extends React.Component {
  render() {
    const { service } = this.props;

    let measure = null;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body;
    } else {
      measure = service.respTraining.body;
    }

    if (
      this.props.configStore.isComponentBlacklisted("TrainingMeasure") ||
      !measure
    )
      return null;

    const measureKeys = Object.keys(measure)
      .filter(
        k =>
          k !== "remain_time_str" &&
          k !== "remain_time" &&
          k !== "iter_time" &&
          k !== "iteration" &&
          k !== "train_loss" &&
          k !== "labels" &&
          k !== "cmfull" &&
          k !== "cmdiag"
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

    if (measureKeys.length === 0) return null;

    return (
      <div className="trainingmeasure">
        <h5>
          <i className="fas fa-braille" /> Training Measures
        </h5>
        <div className="block">
          {measureKeys.map((key, index) => {
            return (
              <div className="row" key={index}>
                <b>{index + 1}</b>&nbsp;{key}
                <br />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

TrainingMeasure.propTypes = {
  service: PropTypes.object.isRequired
};
