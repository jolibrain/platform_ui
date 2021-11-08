import React from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { toJS } from "mobx";
import { Chart, Line } from "react-chartjs-2";

import 'chartjs-plugin-zoom';

@observer
class MeasureChart extends React.Component {
  chartReference = {};

  constructor(props) {
    super(props);

    // colors from src/styles/palettes/chart-badges.scss
    this.state = {
      logScale: false,
      iterTimeScale: false,
      colors: {
        light: [
          "rgba(55,126,184,0.2)",
          "rgba(77,175,74,0.2)",
          "rgba(152,78,163,0.2)",
          "rgba(255,127,0,0.2)",
          "rgba(255,255,51,0.2)",
          "rgba(166,86,40,0.2)",
          "rgba(247,129,191,0.2)",
          "rgba(153,153,153,0.2)"
        ],
        dark: [
          "rgb(55,126,184)",
          "rgb(77,175,74)",
          "rgb(152,78,163)",
          "rgb(255,127,0)",
          "rgb(255,255,51)",
          "rgb(166,86,40)",
          "rgb(247,129,191)",
          "rgb(153,153,153)"
        ]
      },
      bestValue: {
        pointBackgroundColor: "#e31a1c",
        radius: 4
      },
      minValue: {
        pointBackgroundColor: "#e31a1c",
        radius: 4
      },
      verticalLine: {
        strokeStyle: "#e31a1c"
      }
    };

    this.getServiceValue = this.getServiceValue.bind(this);
    this.getValue = this.getValue.bind(this);

    this.getChartData = this.getChartData.bind(this);
    this.getChartDataset = this.getChartDataset.bind(this);

    this.toggleLogScale = this.toggleLogScale.bind(this);
    this.toggleIterTimeScale = this.toggleIterTimeScale.bind(this);
  }

  toggleIterTimeScale() {
    const isIterTimeScale = !this.state.iterTimeScale;
    this.setState({ iterTimeScale: isIterTimeScale });
  }

  toggleLogScale() {
    const isLogScale = !this.state.logScale;
    this.setState({ logScale: isLogScale });

    const { chartInstance } = this.chartReference;
    let yAxe

    if(
      chartInstance &&
        chartInstance.options &&
        chartInstance.options.scales &&
        chartInstance.options.scales.yAxes &&
        chartInstance.options.scales.yAxes.length > 0
    ) {
        yAxe = chartInstance.options.scales.yAxes[0];
    }

    // Missing yAxe, do not toggle
    if(!yAxe) return null;

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
    if (!service) return "--";

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

    if(value) {
      return value;
    } else {
      return '--';
    }

  }

  getBestValue(service, attr) {
    if (!service) return "--";

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

    if(value) {
      return value;
    } else {
      return '--';
    }
  }

  getValue(service, attr) {
    let measure, measure_hist;

    if (!service) return "--";

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

      if(value > 1)
        value = parseFloat(value).toFixed(3);
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
      data: measures ? measures : [],
      fill: false,
      lineTension: 0,
      steppedLine: this.props.steppedLine,
      backgroundColor: this.state.colors.dark[index % 8],
      borderColor: this.state.colors.dark[index % 8],
      showLine: this.state.showLine || this.props.steppedLine ? true : false,
      radius: measures
        ? measures.map(x => (this.props.steppedLine ? 0 : 2))
        : [],
      pointBackgroundColor: measures
        ? measures.map(x => this.state.colors.light[index % 8])
        : [],
      order: index
    };
  }

  getChartData(attr) {
    const { services } = this.props;

    // get first not null service
    const notNullServices = services.filter(s => s)
    let service = null;

    if(notNullServices.length > 0) {
      service = services.filter(s => s)[0];
    }

    let measure_hist, measure;
    if (service.jsonMetrics) {
      measure_hist = service.jsonMetrics.body.measure_hist;
      measure = service.jsonMetrics.body.measure;
    } else if (service.measure_hist && service.measure){
      measure_hist = service.measure_hist;
      measure = service.measure;
    }

    let chartData = {};

    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      let labels = [],
        measures = toJS(measure_hist[`${attr}_hist`]),
        datasets = services.map((s, index) => {
          return s ? this.getChartDataset(s, attr, index) : {};
        });

      // Remove Infinity values from measure_hist
      if (measures.some(x => x === Infinity)) {
        measures = measure_hist[`${attr}_hist`].map(x => {
          return x === Infinity ? 0 : x;
        });
      }

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

      // Fill chartData with missing items
      const maxDatasetLength = Math.max.apply(
        null,
        datasets.map(d => (d.data ? d.data.length : 0))
      );

      datasets.forEach(d => {
        if (d.data && d.data.length < maxDatasetLength) {
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
    if (
      this.props.steppedLine &&
        chartData.datasets &&
        chartData.datasets.length > 0 &&
        chartData.datasets[0].data &&
        chartData.datasets[0].data.length > 0
    ) {

      const data = chartData.datasets[0].data;
      chartData.labels.unshift(0);
      chartData.datasets[0].data.push(data[data.length - 1]);

    }

    return chartData;
  }

  getServiceValue(service, index, attribute, chartData = null) {
    let displayedValue = "--",
      bestValue = null,
      bestValueIndex = null,
      minValue = null,
      minValueIndex = null;

    if (service) {
      displayedValue = this.getValue(service, attribute);

      if (attribute === "train_loss" && displayedValue !== "--") {
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

      if (chartData.datasets && chartData.datasets.length > 0) {

        const selectedDataset = chartData.datasets[index];

        if (selectedDataset &&
            selectedDataset.data &&
            selectedDataset.data.length > 0
           ) {

          if (this.props.showMinValue) {

            minValue = this.getMinValue(service, attribute);
            minValueIndex = selectedDataset.data.indexOf(minValue);

            if (minValueIndex !== -1) {

              // Add colored circle at best value on chart
              selectedDataset["pointBackgroundColor"][minValueIndex] = this.state.minValue.pointBackgroundColor;
              selectedDataset["radius"][minValueIndex] = this.state.minValue.radius;

            }

          }

          if (this.props.showBest) {
            bestValue = this.getBestValue(service, attribute);
            bestValueIndex = selectedDataset.data.indexOf(bestValue);

            if (bestValueIndex !== -1) {

              // Add colored circle at best value on chart
              selectedDataset["pointBackgroundColor"][bestValueIndex] = this.state.bestValue.pointBackgroundColor;
              selectedDataset["radius"][bestValueIndex] = this.state.bestValue.radius;

            }
          }

        }

      }

    }

    const badgeIndex = index % 8;

    return (
      <h3 key={`badge-${badgeIndex}`}>
        <i className={`fa fa-circle chart-badge-${badgeIndex}`} />
        {displayedValue}{" "}
        {this.props.showMinValue && minValue && minValue !== '--' ? (
          <span className="minValue">(min: {parseFloat(minValue).toFixed(minValue > 1 ? 3 : 5)})</span>
        ) : (
          ""
        )}
        {this.props.showBest && bestValue && bestValue !== '--' ? (
          <span className="bestValue">(best: {parseFloat(bestValue).toFixed(bestValue > 1 ? 3 : 5)})</span>
        ) : (
          ""
        )}
        <span className="serviceName"> - {service.name}</span>
      </h3>
    );
  }

  componentWillMount() {
    // Add vertical line drawing when moving cursor around the chart
    Chart.pluginService.register({
      afterDraw: (chart, easing) => {
        if (
          chart &&
          chart.tooltip &&
          chart.tooltip._active &&
          chart.tooltip._active.length > 0
        ) {
          const activePoint = chart.controller.tooltip._active[0];
          const ctx = chart.ctx;
          const x = activePoint.tooltipPosition().x;
          const topY = chart.scales["y-axis-0"].top;
          const bottomY = chart.scales["y-axis-0"].bottom;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = this.state.verticalLine.strokeStyle;
          ctx.stroke();
          ctx.restore();
        }
      }
    });
  }

  render() {
    const { title, attribute } = this.props;
    const { services } = this.props;

    const chartData = this.getChartData(attribute);

    let chartOptions = {
      showAllTooltips: true,
      hover: {
        intersect: false,
        animationDuration: 0
      },
      animation: {
        duration: 0
      },
      plugins: {
        zoom: {
          zoom: {
            enabled: true,
            mode: 'x',
            speed: 5000,
            threshold: 2000,
            sensitivity: 0.0001,
          }
        }
      },
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (tooltipItem, data) => {},
          beforeLabel: (tooltipItem, data) => {},
          labelColor: (tooltipItem) => {
            return {
              backgroundColor: this.state.colors.dark[tooltipItem.datasetIndex]
            }
          },
          label: (tooltipItem, data) => {

            let label = null;

            if (data.datasets && data.datasets.length > 0) {

              const selectedDataset = data.datasets[tooltipItem.datasetIndex];

              if (
                selectedDataset &&
                  selectedDataset.data &&
                  selectedDataset.data.length > 0
              ) {
                let datasetValue = parseFloat(selectedDataset.data[tooltipItem.index]).toFixed(5);
                if(datasetValue > 1) {
                  datasetValue = parseFloat(datasetValue).toFixed(3);
                }

                label = selectedDataset.label + ": " + datasetValue;
              }

            }

            return label;
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

    const values = services.filter(s => s).map((service, index) =>
      this.getServiceValue(service, index, attribute, chartData)
    );

    // if not data available, hide chart
    if (
      !chartData.datasets ||
        chartData.datasets.length === 0 ||
        chartData.datasets.every(d => !d.data || d.data.length === 0)
    )
      return null;

    return (
      <div className={`trainingmonitor-chart ${this.props.layout}`}>
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
              {title}
              {this.props.showLogScale ? (
                <span className="logScale">
                  <input type="checkbox" onChange={this.toggleLogScale} /> Log
                  Scale
                </span>
              ) : (
                ""
              )}
              {this.props.showIterTimeScale ? (
                <span className="iterTimeScale">
                  <input type="checkbox" onChange={this.toggleIterTimeScale} /> Iteration Time on X axe
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
  layout: PropTypes.string.isRequired,
  steppedLine: PropTypes.bool,
  showBest: PropTypes.bool,
  showMinValue: PropTypes.bool,
  services: PropTypes.array.isRequired
};
export default MeasureChart;
