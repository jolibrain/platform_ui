import React from "react";
import { observer, inject } from "mobx-react";

import MeasureChart from "./MeasureChart";

@inject("deepdetectStore")
@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const measure = service.trainMeasure;

    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <MeasureChart title="Train Loss" attribute="train_loss" />
          </div>
          <div className="col-md-3">
            <MeasureChart title="Accuracy" attribute="acc" />
          </div>
          <div className="col-md-3">
            <MeasureChart title="Mean Accuracy" attribute="meanacc" />
          </div>
          <div className="col-md-3">
            <MeasureChart title="Mean IOU" attribute="meaniou" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <span>
              <b># Iteration</b>: {measure.iteration}
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <b>Iteration Time</b>: {measure.iter_time}
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <b>Remaining Time</b>: {measure.remain_time_str}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
