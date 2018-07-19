import React from "react";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("configStore")
@observer
export default class TrainingMeasure extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("TrainingMeasure"))
      return null;

    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const measure = service.trainMeasure;

    if (!measure) return null;

    const measureKeys = Object.keys(measure)
      .filter(k => k !== "remain_time_str")
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
          <i className="fas fa-braille" /> Training Measure
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
