import React from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { toJS } from "mobx";
import { Line } from "react-chartjs-2";

@observer
export default class MeasureChart extends React.Component {
  chartReference = {};

  constructor(props) {
    super(props);

    this.state = {
      logScale: false
    };

    this.getValue = this.getValue.bind(this);
    this.getChartData = this.getChartData.bind(this);

    this.toggleLogScale = this.toggleLogScale.bind(this);
  }

  toggleLogScale() {
    const toggleScale = !this.state.logScale;

    this.setState({ logScale: toggleScale });

    const { chartInstance } = this.chartReference;

    chartInstance.options.scales.yAxes[0].type = toggleScale
      ? "logarithmic"
      : "linear";

    chartInstance.update();
  }

  getMinValue(attr) {
    const { service } = this.props;

    const measure_hist = service.jsonMetrics
      ? service.jsonMetrics.body.measure_hist
      : service.measure_hist;

    let value = null;

    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value = Math.min.apply(Math, measure_hist[`${attr}_hist`]);
    }

    return value ? value.toFixed(5) : "--";
  }

  getBestValue(attr) {
    const { service } = this.props;

    const measure_hist = service.jsonMetrics
      ? service.jsonMetrics.body.measure_hist
      : service.measure_hist;

    let value = null;

    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value = Math.max.apply(Math, measure_hist[`${attr}_hist`]);
    }

    return value ? value.toFixed(5) : "--";
  }

  getValue(attr) {
    const { service } = this.props;

    let measure, measure_hist;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.measure;
      measure_hist = service.measure_hist;
    }

    let value = null;

    if (measure) {
      value = measure[attr];
    } else if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attr}_hist`][measure_hist[`${attr}_hist`].length - 1];
    }

    if (value && !["remain_time_str", "iteration"].includes(attr)) {
      value = value.toFixed(5);
    }

    return value !== null ? value : "--";
  }

  getChartData(attr) {
    const { service } = this.props;

    let measure_hist;
    if (service.jsonMetrics) {
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure_hist = service.measure_hist;
    }

    let chartData = {};
    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      const measures = toJS(measure_hist[`${attr}_hist`]).filter(
        x => x !== Infinity
      );
      chartData = {
        labels: Array.apply(null, Array(measures.length)),
        datasets: [
          {
            data: measures.map(x => (x ? x.toFixed(5) : null)),
            fill: false,
            lineTension: 0,
            steppedLine: this.props.steppedLine,
            backgroundColor: "hsl(210, 22%, 49%)",
            borderColor: "hsl(210, 22%, 49%)",
            showLine:
              this.state.showLine || this.props.steppedLine ? true : false,
            radius: measures.map(x => (this.props.steppedLine ? 0 : 2)),
            pointBackgroundColor: measures.map(x => "hsl(210, 22%, 80%)")
          }
        ]
      };
    }

    // Add dummy data at the end of array to clearly see stepped line
    if (this.props.steppedLine && chartData.datasets) {
      const data = chartData.datasets[0].data;
      chartData.labels.push(null);
      chartData.datasets[0].data.push(data[data.length - 1]);
    }

    return chartData;
  }

  render() {
    const { title, attribute } = this.props;

    const chartData = this.getChartData(attribute);

    if (
      typeof chartData.datasets === "undefined" ||
      chartData.datasets[0].data.length === 0
    )
      return null;

    let chartOptions = {
      animation: {
        duration: 0
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {},
          beforeLabel: (tooltipItem, data) => {},
          label: (tooltipItem, data) => {
            return data.datasets[tooltipItem.datasetIndex].data[
              tooltipItem.index
            ];
          }
        }
      },
      scales: {
        xAxes: [
          {
            display: false
          }
        ]
      }
    };

    let minValue = null;
    if (this.props.showMinValue) {
      minValue = this.getMinValue(attribute);
    }

    let bestValue = null;
    if (this.props.showBest) {
      bestValue = this.getBestValue(attribute);
      const bestValueIndex = chartData.datasets[0].data.indexOf(bestValue);
      chartData.datasets[0]["pointBackgroundColor"][bestValueIndex] =
        "hsl(360, 67%, 44%)";
      chartData.datasets[0]["radius"][bestValueIndex] = 4;
    }

    let displayedValue = this.getValue(attribute);

    if (attribute === "train_loss") {
      displayedValue = parseFloat(displayedValue);

      if (typeof displayedValue.toFixed === "function") {
        if (displayedValue > 1) {
          displayedValue = displayedValue.toFixed(3);
        } else {
          // Find position of first number after the comma
          const zeroPosition = displayedValue
            .toString()
            .split("0")
            .slice(2)
            .findIndex(elem => elem.length > 0);

          displayedValue = displayedValue.toFixed(zeroPosition + 4);
        }
      }
    }

    return (
      <div className="trainingmonitor-chart col-lg-3 col-md-6">
        <div className="chart container">
          <div className="row">
            <Line
              data={chartData}
              legend={{ display: false }}
              options={chartOptions}
              ref={reference => (this.chartReference = reference)}
            />
          </div>
          <div className="description row">
            <h3>
              {displayedValue}{" "}
              {this.props.showMinValue ? (
                <span className="minValue">(min: {minValue})</span>
              ) : (
                ""
              )}
              {this.props.showBest ? (
                <span className="bestValue">(best: {bestValue})</span>
              ) : (
                ""
              )}
            </h3>
            <h4>
              {title}{" "}
              {this.props.showLogScale ? (
                <span className="logScale">
                  <input type="checkbox" onChange={this.toggleLogScale} /> Log
                  Scale
                </span>
              ) : (
                ""
              )}
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

MeasureChart.propTypes = {
  title: PropTypes.string.isRequired,
  attribute: PropTypes.string.isRequired,
  steppedLine: PropTypes.bool,
  service: PropTypes.object.isRequired
};
