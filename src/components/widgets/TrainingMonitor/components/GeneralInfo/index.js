import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import MeasureChart from "../MeasureChart";
import TrainLossChart from "../TrainLossChart";

@observer
export default class GeneralInfo extends React.Component {
  render() {
    let infoCharts = [];

    const { service } = this.props;

    if (!service.jsonMetrics && !service.respInfo) return null;

    let mltype = null;

    if (service.jsonMetrics) {
      mltype = service.jsonMetrics.body.mltype;
    } else {
      if (
        service.respInfo &&
        service.respInfo.body &&
        service.respInfo.body.mltype
      )
        mltype = service.respInfo.body.mltype;
    }

    let bestModelInfo = null;
    if (service.bestModel) {
      bestModelInfo = (
        <div>
          <hr />
          <p>Best Model</p>
          <ul>
            {Object.keys(service.bestModel).map((k, i) => {
              let attrTitle =
                i === 0
                  ? k.replace(/\b\w/g, l => l.toUpperCase())
                  : k.toUpperCase();

              if (attrTitle === "MEANIOU") attrTitle = "Mean IOU";

              return (
                <li key={i}>
                  {attrTitle}: <b>{service.bestModel[k]}</b>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    infoCharts.push(
      <TrainLossChart
        title="Train Loss"
        key="train_loss"
        attribute="train_loss"
        {...this.props}
      />
    );

    switch (mltype) {
      case "segmentation":
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute="acc"
            key="acc"
            steppedLine={true}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            key="meanacc"
            steppedLine={true}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean IOU"
            attribute="meaniou"
            key="meaniou"
            steppedLine={true}
            {...this.props}
          />
        );
        break;
      case "detection":
        infoCharts.push(
          <MeasureChart
            title="MAP"
            attribute="map"
            key="map"
            steppedLine={true}
            {...this.props}
          />
        );
        break;
      case "classification":
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute="acc"
            key="acc"
            steppedLine={true}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            key="meanacc"
            steppedLine={true}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="F1"
            attribute="f1"
            key="f1"
            steppedLine={true}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mcll"
            attribute="mcll"
            key="mcll"
            steppedLine={true}
            {...this.props}
          />
        );
        break;
      case "regression":
        infoCharts.push(
          <MeasureChart
            title="Eucll"
            attribute="eucll"
            key="eucll"
            steppedLine={true}
            {...this.props}
          />
        );
        break;
      case "ctc":
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute="acc"
            key="acc"
            steppedLine={true}
            {...this.props}
          />
        );
        break;
      default:
        break;
    }

    return (
      <div className="trainingmonitor-generalinfo">
        <div className="row">{infoCharts}</div>
        <div className="row">{bestModelInfo}</div>
      </div>
    );
  }
}

GeneralInfo.propTypes = {
  service: PropTypes.object.isRequired
};
