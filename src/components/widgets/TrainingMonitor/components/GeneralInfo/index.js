import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import MeasureChart from "../MeasureChart";

@observer
export default class GeneralInfo extends React.Component {
  render() {
    let infoCharts = [];

    const { service } = this.props;

    if (!service.jsonMetrics && !service.respInfo) return null;

    let measure,
      mltype = null;

    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      mltype = service.jsonMetrics.body.mltype;
    } else {
      measure = service.measure;
      if (
        service.respInfo &&
        service.respInfo.body &&
        service.respInfo.body.mltype
      )
        mltype = service.respInfo.body.mltype;
    }

    infoCharts.push(
      <MeasureChart
        title="Train Loss"
        key="train_loss"
        attribute="train_loss"
        showMinValue
        showLogScale
        {...this.props}
      />
    );

    if (typeof measure !== "undefined") {
      if (typeof measure.accp !== "undefined") {
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            key="accp"
            attribute="accp"
            steppedLine
            {...this.props}
          />
        );
      } else if (typeof measure.acc !== "undefined") {
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            key="acc"
            attribute="acc"
            steppedLine
            {...this.props}
          />
        );
      }
    }

    switch (mltype) {
      case "segmentation":
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            key="meanacc"
            steppedLine
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean IOU"
            attribute="meaniou"
            key="meaniou"
            steppedLine
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
            steppedLine
            {...this.props}
          />
        );
        break;
      case "classification":
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            key="meanacc"
            steppedLine
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="F1"
            attribute="f1"
            key="f1"
            steppedLine
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mcll"
            attribute="mcll"
            key="mcll"
            steppedLine
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
            steppedLine
            {...this.props}
          />
        );
        break;
      case "ctc":
        break;
      default:
        break;
    }

    return (
      <div className="trainingmonitor-generalinfo row charts">{infoCharts}</div>
    );
  }
}

GeneralInfo.propTypes = {
  service: PropTypes.object.isRequired
};
