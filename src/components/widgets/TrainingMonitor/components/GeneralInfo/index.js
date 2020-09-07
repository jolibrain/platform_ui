import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import MeasureChart from "../MeasureChart";

// # Training Monitor
//
// ## Measure values
//
// `measure` data is found in:
//
// * `metrics.json` saved file
// * or in DeepDetect `GET /train` API call
//
// ## Default charts
//
// A default `train_loss` chart is displayed.
//
// An Accuracy chart can be displayed if `measure.acc` or `measure.accp` exists
//
// ## mltype
//
// `mltype` value is found in:
//
// * `metrics.json` saved file
// * or DeepDetect `GET /service_name` service info API call.
//
// Each type pushes various charts on `TrainingShow` and `TrainingArchive` pages:
//
// * segmentation
//   * meaniou
//   * meanacc
//
// * detection
//   * map
//
// * classification
//   * meanacc
//   * f1
//   * mcll
//
// * regression
//   * eucll
//

@observer
class GeneralInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: "col-md-6"
    };

    this.selectedLayout = this.selectLayout.bind(this);
  }

  selectLayout(layout) {
    this.setState({ layout: layout });
  }

  render() {
    let infoCharts = [];

    const { layout } = this.state;
    let { services } = this.props;

    // get first not null service
    const service = services.filter(s => s)[0];

    if (!service || (!service.jsonMetrics && !service.respInfo)) return null;

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
        layout={layout}
        {...this.props}
      />
    );

    let hasMap = false;

    if (typeof measure !== "undefined" && measure !== null) {
      if (typeof measure.accp !== "undefined") {
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            key="accp"
            attribute="accp"
            steppedLine
            showBest
            layout={layout}
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
            showBest
            layout={layout}
            {...this.props}
          />
        );
      } else if (typeof measure.map !== "undefined") {
        hasMap = true;
        infoCharts.push(
          <MeasureChart
            title="Map"
            key="map"
            attribute="map"
            steppedLine
            showBest
            useBestValue
            layout={layout}
            {...this.props}
          />
        );
      }
    }

    switch (mltype) {
      case "segmentation":
        infoCharts.push(
          <MeasureChart
            title="Mean IOU"
            attribute="meaniou"
            key="meaniou"
            steppedLine
            showBest
            layout={layout}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mean Accuracy"
            attribute="meanacc"
            key="meanacc"
            steppedLine
            layout={layout}
            {...this.props}
          />
        );
        break;
      case "detection":
        if (!hasMap)
          infoCharts.push(
            <MeasureChart
              title="MAP"
              attribute="map"
              key="map"
              steppedLine
              showBest
              useBestValue
              layout={layout}
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
            layout={layout}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="F1"
            attribute="f1"
            key="f1"
            steppedLine
            layout={layout}
            {...this.props}
          />
        );
        infoCharts.push(
          <MeasureChart
            title="Mcll"
            attribute="mcll"
            key="mcll"
            steppedLine
            layout={layout}
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
            layout={layout}
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
      <div>
        <div className="trainingmonitor-layout row">
          <i
            className={`text-right fa fa-stop ${
              layout === "col-md-12" ? "selected-layout" : ""
            }`}
            onClick={() => this.selectLayout("col-md-12")}
          />
          <i
            className={`text-right fa fa-th-large ${
              layout === "col-md-6" ? "selected-layout" : ""
            }`}
            onClick={() => this.selectLayout("col-md-6")}
          />
          <i
            className={`text-right fa fa-th ${
              layout === "col-md-3" ? "selected-layout" : ""
            }`}
            onClick={() => this.selectLayout("col-md-3")}
          />
        </div>
        <div className="trainingmonitor-generalinfo row charts">
          {infoCharts}
        </div>
      </div>
    );
  }
}

GeneralInfo.propTypes = {
  services: PropTypes.array.isRequired
};
export default GeneralInfo;
