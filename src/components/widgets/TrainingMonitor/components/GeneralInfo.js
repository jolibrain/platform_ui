import React from "react";
import { observer, inject } from "mobx-react";

import MeasureChart from "./MeasureChart";

@inject("deepdetectStore")
@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    if (!service || !service.trainMeasure) return null;

    const measure = service.trainMeasure;

    let infoCharts = [];

    infoCharts.push(
      <div className="col-md-3">
        <MeasureChart title="Train Loss" attribute="train_loss" />
      </div>
    );

    infoCharts.push(
      <div className="col-md-3">
        <MeasureChart title="Accuracy" attribute="acc" steppedLine={true} />
      </div>
    );

    infoCharts.push(
      <div className="col-md-3">
        <MeasureChart
          title="Mean Accuracy"
          attribute="meanacc"
          steppedLine={true}
        />
      </div>
    );

    switch (service.settings.mltype) {
      case "segmentation":
        infoCharts.push(
          <div className="col-md-3">
            <MeasureChart
              title="Mean IOU"
              attribute="meaniou"
              steppedLine={true}
            />
          </div>
        );
        break;
      case "detection":
        infoCharts.push(
          <div className="col-md-3">
            <MeasureChart title="MAP" attribute="map" steppedLine={true} />
          </div>
        );
        break;
      case "classification":
        infoCharts.push(
          <div className="col-md-3">
            <MeasureChart title="F1" attribute="f1" steppedLine={true} />
          </div>
        );
        break;
      case "regression":
        infoCharts.push(
          <div className="col-md-3">
            <MeasureChart title="Eucll" attribute="eucll" steppedLine={true} />
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div className="trainingmonitor-generalinfo">
        <div className="row">{infoCharts}</div>
        <div className="row">
          <div className="col-md-3">
            <span>
              <b># Iteration</b>: {measure.iteration}
            </span>
          </div>
          <div className="col-md-3">
            <span>
              <b>Iteration Time</b>: {measure.iter_time}
            </span>
          </div>
          <div className="col-md-6">
            <span>
              <b>Remaining Time</b>: {measure.remain_time_str}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
