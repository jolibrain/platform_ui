import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import MeasureChart from "../MeasureChart";
import MeasureMultiAttrChart from "../MeasureMultiAttrChart";

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
  }

  selectLayout(layout) {
    this.setState({ layout: layout });
  }

  // When measure attribute key includes suffixes,
  // ie. `meaniou_test0` is the key for `meaniou` attribute,
  // returns this key to display main charts
  findMeasureAttr(measure, rootKey) {
    return Object.keys(measure)
                 .find(k => k.startsWith(rootKey))
  }

  render() {
    let infoCharts = [];

    const { layout } = this.state;
    let { services } = this.props;

    // get first not null service
    const service = services.filter(s => s)[0];

    if (!service || (!service.jsonMetrics && !service.respInfo)) return null;

    let measure,
        measures,
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
      measures = service.jsonMetrics.body.measures;
      mltype = service.jsonMetrics.body.mltype;
    } else {
      measure = service.measure;
      measures = service.measures;
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

      accpAttr = this.findMeasureAttr(measure, 'accp');
      accAttr = this.findMeasureAttr(measure, 'acc');

      if (typeof accpAttr !== "undefined") {

        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute={accpAttr}
            key="accp"
            steppedLine
            showBest
            layout={layout}
            {...this.props}
          />
        );

      } else if (typeof accAttr !== "undefined") {

        infoCharts.push(
          <MeasureChart
            title="Accuracy"
            attribute={accAttr}
            key="acc"
            steppedLine
            showBest
            layout={layout}
            {...this.props}
          />
        );
      }

      mapAttr = this.findMeasureAttr(measure, 'map');

      if (typeof mapAttr !== "undefined") {

        hasMap = true;

        infoCharts.push(
          <MeasureChart
            title="Map"
            attribute={mapAttr}
            key="map"
            steppedLine
            showBest
            useBestValue
            layout={layout}
            {...this.props}
          />
        );
      }

      const multipleMapDataset = typeof measures !== 'undefined' &&
            measures.length > 1 &&
            measures.every( m => typeof m['map'] !== 'undefined' )

      if(multipleMapDataset) {

        const multipleDatasetAttr = measures
              .map(m => `map_test${m['test_id']}`)

        infoCharts.push(
          <MeasureMultiAttrChart
            title="Map"
            key="map-datasets"
            attributes={multipleDatasetAttr}
            steppedLine
            showBest
            useBestValue
            layout={layout}
            {...this.props}
          />
        );
      }

      eucllAttr = this.findMeasureAttr(measure, 'eucll');

      if (typeof eucllAttr !== "undefined") {

        hasEucll = true;

        infoCharts.push(
          <MeasureChart
            title="Eucll"
            key="eucll"
            attribute={eucllAttr}
            steppedLine
            showMinValue
            layout={layout}
            {...this.props}
          />
        );
      }

      if (
        typeof eucllAttr !== "undefined" &&
          !service.isTimeseries
      ) {

        meanIouAttr = this.findMeasureAttr(measure, 'meaniou');
        if(typeof meanIouAttr !== 'undefined') {

          hasMeanIou = true;
          infoCharts.push(
            <MeasureChart
              title="Mean IOU"
              key="meaniou"
              attribute={meanIouAttr}
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

      meanIouAttr = this.findMeasureAttr(measure, 'meaniou');

      if(typeof meanIouAttr !== 'undefined') {

        hasMeanIou = true;
        infoCharts.push(
          <MeasureChart
            title="Mean IOU"
            key="meaniou"
            attribute={meanIouAttr}
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

          meanIouAttr = this.findMeasureAttr(measure, 'meaniou');

          if(typeof meanIouAttr !== 'undefined') {

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

        meanAccAttr = this.findMeasureAttr(measure, 'meanacc');

        if(typeof meanAccAttr !== 'undefined') {

          infoCharts.push(
            <MeasureChart
              title="Mean Accuracy"
              key="meanacc"
              attribute={meanAccAttr}
              steppedLine
              layout={layout}
              {...this.props}
            />
          );

        }

        break;

      case "detection":

        if (!hasMap) {

          mapAttr = this.findMeasureAttr(measure, 'map');

          if(typeof mapAttr !== 'undefined') {
            infoCharts.push(
              <MeasureChart
                title="MAP"
                attribute={mapAttr}
                key="map"
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

        meanAccAttr = this.findMeasureAttr(measure, 'meanacc');
        f1Attr = this.findMeasureAttr(measure, 'f1');
        mcllAttr = this.findMeasureAttr(measure, 'mcll');

        if(typeof meanAccAttr !== 'undefined') {

          infoCharts.push(
            <MeasureChart
              title="Mean Accuracy"
              attribute={meanAccAttr}
              key="meanacc"
              steppedLine
              layout={layout}
              {...this.props}
            />
          );

        }

        if(typeof f1Attr !== 'undefined') {

          infoCharts.push(
            <MeasureChart
              title="F1"
              attribute={f1Attr}
              key="f1"
              steppedLine
              layout={layout}
              {...this.props}
            />
          );

        }

        if(typeof mcllAttr !== 'undefined') {

          infoCharts.push(
            <MeasureChart
              title="Mcll"
              attribute={mcllAttr}
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

          eucllAttr = this.findMeasureAttr(measure, 'eucll');

          if(typeof eucllAttr !== 'undefined') {
            infoCharts.push(
              <MeasureChart
                title="Eucll"
                attribute={eucllAttr}
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
