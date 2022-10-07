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

    this.selectLayout = this.selectLayout.bind(this);
    this.findMeasureAttr = this.findMeasureAttr.bind(this);
    this.hasMeasureAttr = this.hasMeasureAttr.bind(this);
  }

  selectLayout(layout) {
    this.setState({ layout: layout });
  }

  // When measure attribute key includes suffixes,
  // ie. `meaniou_test0` is the key for `meaniou` attribute,
  // returns this key to display main charts
  findMeasureAttr(measure, rootKey) {
    // filter: filter out keys containing class index
    return Object.keys(measure)
                 .filter(k => !k.match(/.*_\d+_.*/))
                 .find(k => k.startsWith(rootKey))
  }

  hasMeasureAttr(measure, rootKey) {
    return Object.keys(measure)
                 .filter(k => !k.match(/.*_\d+_.*/)).length !== 0;
  }

  render() {
    let infoCharts = [];

    const { layout } = this.state;
    let { services } = this.props;

    // get first not null service
    const service = services.filter(s => s)[0];

    if (!service || (!service.jsonMetrics && !service.respInfo)) return null;

    let measure,
        mltype = null,
        accpAttr,
        accAttr,
        meanIouAttr,
        meanAccAttr,
        f1Attr,
        mcllAttr,
        eucllAttr,
        mapAttr;

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

    // const hasMeasureElapsedTime = services.some(service => {
    //   const measure_hist = service.jsonMetrics
    //     ? service.jsonMetrics.body.measure_hist
    //     : service.measure_hist;

    //   return 'elapsed_time_ms_hist' in measure_hist;
    // })

    // showIterTimeScale={hasMeasureElapsedTime}

    infoCharts.push(
      <MeasureChart
        title="Train Loss"
        attribute="train_loss"
        key="train_loss"
        beginAtZero
        showMinValue
        showLogScale
        layout={layout}
        {...this.props}
      />
    );

    let hasMap = false,
        hasEucll = false,
        hasMeanIou = false;

    if (typeof measure !== "undefined" && measure !== null) {

      if (this.hasMeasureAttr("accp")) {
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute={"accp"}
            key="accp"
            steppedLine
            showBest
            layout={layout}
            {...this.props}
          />
        );
      } else if (this.hasMeasureAttr("acc")) {
        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute={"acc"}
            key="acc"
            steppedLine
            showBest
            layout={layout}
            {...this.props}
          />
        );
      }
      if (this.hasMeasureAttr(measure, 'map')) {
        hasMap = true;

        infoCharts.push(
          <MeasureChart
            title="Map"
            attribute={"map"}
            key="map"
            beginAtZero
            steppedLine
            showBest
            useBestValue
            layout={layout}
            {...this.props}
          />
        );
      }

      if (this.hasMeasureAttr(measure, "eucll")) {
        hasEucll = true;

        infoCharts.push(
          <MeasureChart
            title="Eucll"
            key="eucll"
            attribute={"eucll"}
            beginAtZero
            steppedLine
            showMinValue
            layout={layout}
            {...this.props}
          />
        );
      }

      if (
        hasEucll &&
          !service.isTimeseries
      ) {
        if(this.hasMeasureAttr(measure, "meaniou")) {

          hasMeanIou = true;
          infoCharts.push(
            <MeasureChart
              title="Mean IOU"
              key="meaniou"
              attribute={"meaniou"}
              steppedLine
              showBest
              layout={layout}
              {...this.props}
            />
          );
        }
      }
    }

    //
    // Some segmentation services doesn't declare themselves with
    // body.mltype: segmentation
    //
    // Fix this issue by finding if service best model file includes
    // meaniou key
    //
    if (
      !hasMeanIou &&
        mltype !== "segmentation" &&
        service.bestModel &&
        !service.isTimeseries
    ) {
      if(this.hasMeasureAttr(measure, "meaniou")) {
        hasMeanIou = true;
        infoCharts.push(
          <MeasureChart
            title="Mean IOU"
            key="meaniou"
            attribute={"meaniou"}
            steppedLine
            showBest
            layout={layout}
            {...this.props}
          />
        );

      }
    }

    switch (mltype) {
      case "segmentation":

        if(!hasMeanIou) {

          if(this.hasMeasureAttr(measure, "meaniou")) {
            infoCharts.push(
              <MeasureChart
                title="Mean IOU"
                key='meaniou'
                attribute={meanIouAttr}
                steppedLine
                showBest
                layout={layout}
                {...this.props}
              />
            );
          }
        }

        if(this.hasMeasureAttr(measure, "meanacc")) {
          infoCharts.push(
            <MeasureChart
              title="Mean Accuracy"
              key="meanacc"
              attribute={"meanacc"}
              steppedLine
              layout={layout}
              {...this.props}
            />
          );

        }

        break;

      case "detection":

        if (!hasMap) {

          if (this.hasMeasureAttr(measure, 'map')) {
            hasMap = true;

            infoCharts.push(
              <MeasureChart
                title="Map"
                attribute={"map"}
                key="map"
                beginAtZero
                steppedLine
                showBest
                useBestValue
                layout={layout}
                {...this.props}
              />
            );
          }
        }
        break;
      case "classification":
        if(this.hasMeasureAttr(measure, 'meanacc')) {

          infoCharts.push(
            <MeasureChart
              title="Mean Accuracy"
              attribute={'meanacc'}
              key="meanacc"
              steppedLine
              layout={layout}
              {...this.props}
            />
          );
        }

        if(this.hasMeasureAttr(measure, 'f1')) {

          infoCharts.push(
            <MeasureChart
              title="F1"
              attribute={'f1'}
              key="f1"
              steppedLine
              layout={layout}
              {...this.props}
            />
          );
        }

        if(this.hasMeasureAttr(measure, 'mcll')) {

          infoCharts.push(
            <MeasureChart
              title="Mcll"
              attribute={'mcll'}
              key="mcll"
              steppedLine
              layout={layout}
              {...this.props}
            />
          );
        }

        break;
      case "regression":

        if (!hasEucll) {

          if(this.hasMeasureAttr(measure, 'eucll')) {
            infoCharts.push(
              <MeasureChart
                title="Eucll"
                attribute={'eucll'}
                key="eucll"
                steppedLine
                showMinValue
                layout={layout}
                {...this.props}
              />
            );
          }
        }

        break;
      case "ctc":
        break;
      default:
        break;
    }

    if ( service.isTimeseries ) {
      infoCharts.push(
        <MeasureChart
          title="L1 Mean Error"
          attribute="L1_mean_error"
          key="L1_mean_error"
          beginAtZero
          steppedLine
          showMinValue
          layout={layout}
          {...this.props}
        />
      );
      infoCharts.push(
        <MeasureChart
          title="L2 Mean Error"
          attribute="L2_mean_error"
          key="L2_mean_error"
          beginAtZero
          steppedLine
          showMinValue
          layout={layout}
          {...this.props}
        />
      );
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
