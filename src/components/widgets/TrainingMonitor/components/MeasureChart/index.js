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

    // colors from src/styles/palettes/chart-badges.scss
    this.state = {
      logScale: false,
      colors: {
        light: [
          "rgba(166,206,227,0.2)",
          "rgba(178,223,138,0.2)",
          "rgba(251,154,153,0.2)",
          "rgba(253,191,111,0.2)",
          "rgba(202,178,214,0.2)",
          "rgba(255,255,153,0.2)",
          "rgba(31,120,180,0.2)",
          "rgba(51,160,44,0.2)",
          "rgba(227,26,28,0.2)",
          "rgba(255,127,0,0.2)",
          "rgba(106,61,154,0.2)",
          "rgba(177,89,40,0.2)"
        ],
        dark: [
          "rgb(166,206,227)",
          "rgb(178,223,138)",
          "rgb(251,154,153)",
          "rgb(253,191,111)",
          "rgb(202,178,214)",
          "rgb(255,255,153)",
          "rgb(31,120,180)",
          "rgb(51,160,44)",
          "rgb(227,26,28)",
          "rgb(255,127,0)",
          "rgb(106,61,154)",
          "rgb(177,89,40)"
        ]
      }
    };

    this.getServiceValue = this.getServiceValue.bind(this);
    this.getValue = this.getValue.bind(this);

    this.getChartData = this.getChartData.bind(this);
    this.getChartDataset = this.getChartDataset.bind(this);

    this.toggleLogScale = this.toggleLogScale.bind(this);
  }

  toggleLogScale() {
    const isLogScale = !this.state.logScale;
    this.setState({ logScale: isLogScale });

    const { chartInstance } = this.chartReference;
    const yAxe = chartInstance.options.scales.yAxes[0];

    if (isLogScale) {
      // Add a userCallback function on logarithmic y axe
      // to avoid issue with lots of labels on this axe
      // https://github.com/chartjs/Chart.js/issues/4722#issuecomment-353067548
      yAxe.type = "logarithmic";
      yAxe.ticks = {
        labels: {
          index: ["min", "max"],
          significand: [1],
          removeEmptyLines: true
        },
        userCallback: function(tickValue, index, ticks) {
          var me = this;
          var labelOpts = me.options.ticks.labels || {};
          var labelIndex = labelOpts.index || ["min", "max"];
          var labelSignificand = labelOpts.significand || [1, 2, 5];
          var significand =
            tickValue / Math.pow(10, Math.floor(Math.log10(tickValue)));
          var emptyTick = labelOpts.removeEmptyLines === true ? undefined : "";
          var namedIndex = "";

          if (index === 0) {
            namedIndex = "min";
          } else if (index === ticks.length - 1) {
            namedIndex = "max";
          }

          if (
            labelOpts === "all" ||
            labelSignificand.indexOf(significand) !== -1 ||
            labelIndex.indexOf(index) !== -1 ||
            labelIndex.indexOf(namedIndex) !== -1
          ) {
            if (tickValue === 0) {
              return "0";
            } else {
              return tickValue.toExponential();
            }
          }
          return emptyTick;
        }
      };
    } else {
      // Restore initial linear y axe, with no tick options
      yAxe.type = "linear";
      yAxe.ticks = {};
    }

    chartInstance.update();
  }

  getMinValue(service, attr) {
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

  getBestValue(service, attr) {
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

  getValue(service, attr) {
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

  getChartDataset(service, attr, index) {
    let measure_hist, measures;
    if (service.jsonMetrics) {
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure_hist = service.measure_hist;
    }

    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      measures = toJS(measure_hist[`${attr}_hist`]);
      // Remove Infinity values from measure_hist
      if (measures.some(x => x === Infinity)) {
        measures = measure_hist[`${attr}_hist`].map(x => {
          return x === Infinity ? 0 : x;
        });
      }
    }

    // old colors
    // light: hsl(210, 22%, 49%)
    // dark: hsl(210, 22%, 80%)

    return {
      label: service.name,
      data: measures ? measures.map(x => (x ? x.toFixed(5) : null)) : [],
      fill: false,
      lineTension: 0,
      steppedLine: this.props.steppedLine,
      backgroundColor: this.state.colors.dark[index],
      borderColor: this.state.colors.dark[index],
      showLine: this.state.showLine || this.props.steppedLine ? true : false,
      radius: measures
        ? measures.map(x => (this.props.steppedLine ? 0 : 2))
        : [],
      pointBackgroundColor: measures
        ? measures.map(x => this.state.colors.light[index])
        : [],
      order: index
    };
  }

  getChartData(attr) {
    let { service, services } = this.props;

    // When multiple services,
    // use first service as referential to know which chart will be displayed
    if (services && services.length > 0 && !service) {
      service = services[0];
    } else {
      // Create array with only service in order to build dataset
      services = [service];
    }

    let measure_hist, measure;
    if (service.jsonMetrics) {
      measure_hist = service.jsonMetrics.body.measure_hist;
      measure = service.jsonMetrics.body.measure;
    } else {
      measure_hist = service.measure_hist;
      measure = service.measure;
    }

    let chartData = {};
    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      let measures = toJS(measure_hist[`${attr}_hist`]);
      // Remove Infinity values from measure_hist
      if (measures.some(x => x === Infinity)) {
        measures = measure_hist[`${attr}_hist`].map(x => {
          return x === Infinity ? 0 : x;
        });
      }

      let labels = [];
      if (measure && measure.iteration) {
        // Create labels array from iteration count
        const ratio = measure.iteration / measures.length;
        for (var i = 0; i < measures.length; i++) {
          labels.push(parseInt(i * ratio, 10));
        }

        // Force latest label to be iteration number
        labels[labels.length - 1] = measure.iteration;
      } else {
        // When measure object is not available
        // in archived jobs for example
        for (var j = 0; j < measures.length; j++) {
          labels.push(j);
        }
      }

      let datasets = services.map((s, index) =>
        this.getChartDataset(s, attr, index)
      );

      // Fill chartData with missing items
      const maxDatasetLength = Math.max.apply(
        null,
        datasets.map(d => d.data.length)
      );
      datasets.forEach(d => {
        if (d.data.length < maxDatasetLength) {
          const emptyItems = new Array(maxDatasetLength - d.data.length);
          d.data.push(...emptyItems);
          d.radius.push(...emptyItems);
          d.pointBackgroundColor.push(...emptyItems);
        }
      });

      chartData = {
        labels: labels,
        datasets: datasets
      };
    }

    // Add dummy data at the end of array to clearly see stepped line
    if (this.props.steppedLine && chartData.datasets) {
      const data = chartData.datasets[0].data;
      chartData.labels.unshift(0);
      chartData.datasets[0].data.push(data[data.length - 1]);
    }

    return chartData;
  }

  getServiceValue(service, index, attribute, chartData = null) {
    let displayedValue = this.getValue(service, attribute);

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

    let minValue = null;
    if (this.props.showMinValue) {
      minValue = this.getMinValue(service, attribute);
    }

    let bestValue = null;
    if (this.props.showBest) {
      bestValue = this.getBestValue(service, attribute);
      const bestValueIndex = chartData.datasets[index].data.indexOf(bestValue);
      chartData.datasets[index]["pointBackgroundColor"][bestValueIndex] =
        "hsl(360, 67%, 44%)";
      chartData.datasets[index]["radius"][bestValueIndex] = 4;
    }

    const badge =
      this.props.services && this.props.services.length > 0 ? (
        <i className={`fa fa-circle chart-badge-${index}`} />
      ) : null;

    return (
      <h3>
        {badge}
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
    );
  }

  render() {
    const { title, attribute } = this.props;
    let { service, services } = this.props;

    // When multiple services,
    // use first service as referential to know which chart will be displayed
    if (services && services.length > 0 && !service) {
      service = services[0];
    } else {
      // Create array with only service in order to build dataset
      services = [service];
    }

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
            //display: false
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
              callback: function(value, index, values) {
                let output = value;
                if (value > 1000) {
                  output = Math.ceil(value / 100) * 100;
                }
                if (index === values.length - 1) {
                  output = value;
                }
                return output;
              }
            }
          }
        ]
      }
    };

    const values = services.map((service, index) =>
      this.getServiceValue(service, index, attribute, chartData)
    );

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
            {values}
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
  service: PropTypes.object,
  services: PropTypes.array
};
