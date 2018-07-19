import React from "react";
import { observer, inject } from "mobx-react";

import MeasureChart from "./MeasureChart";

@inject("deepdetectStore")
@observer
export default class GeneralInfo extends React.Component {
  render() {
    const { server } = this.props.deepdetectStore;

    if (!server.service || !server.service.trainMeasure) return null;

    const measure = server.service.trainMeasure;

    let infoCharts = [];

    infoCharts.push(<MeasureChart title="Train Loss" attribute="train_loss" />);

    switch (server.service.settings.mltype) {
      case "segmentation":
        infoCharts.push(
          <MeasureChart title="Accuracy" attribute="acc" steppedLine={true} />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            steppedLine={true}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean IOU"
            attribute="meaniou"
            steppedLine={true}
          />
        );
        break;
      case "detection":
        infoCharts.push(
          <MeasureChart title="Accuracy" attribute="acc" steppedLine={true} />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            steppedLine={true}
          />
        );
        infoCharts.push(
          <MeasureChart title="MAP" attribute="map" steppedLine={true} />
        );
        break;
      case "classification":
        infoCharts.push(
          <MeasureChart title="Accuracy" attribute="acc" steppedLine={true} />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            steppedLine={true}
          />
        );
        infoCharts.push(
          <MeasureChart title="F1" attribute="f1" steppedLine={true} />
        );
        break;
      case "regression":
        infoCharts.push(
          <MeasureChart title="Eucll" attribute="eucll" steppedLine={true} />
        );
        break;
      default:
        break;
    }

    return (
      <div className="trainingmonitor-generalinfo">
        <div className="row">
          {infoCharts.map((chart, index) => {
            return (
              <div className="col-md-3" key={index}>
                {chart}
              </div>
            );
          })}
        </div>
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
