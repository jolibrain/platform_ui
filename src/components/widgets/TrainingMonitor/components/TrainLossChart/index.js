import React from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { toJS } from "mobx";
import { Line } from "react-chartjs-2";

@observer
export default class MeasureChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLine: false
    };

    this.getValue = this.getValue.bind(this);
    this.getChartData = this.getChartData.bind(this);

    this.toggleShowLine = this.toggleShowLine.bind(this);
  }

  toggleShowLine() {
    this.setState({ showLine: !this.state.showLine });
  }

  getMinValue(attr) {
    const { service } = this.props;

    const measure_hist = service.jsonMetrics
      ? service.jsonMetrics.body.measure_hist
      : service.measure_hist;

    let value = "--";

    if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value = Math.min.apply(Math, measure_hist[`${attr}_hist`]);
    }

    return value.toFixed(10);
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

    let value = "--";

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

    return value.toFixed(10);
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
      const measures = toJS(measure_hist[`${attr}_hist`]);
      chartData = {
        labels: Array.apply(null, Array(measures.length)),
        datasets: [
          {
            data: measures.map(x => (x ? x.toFixed(5) : null)),
            fill: false,
            lineTension: 0,
            steppedLine: this.props.steppedLine,
            backgroundColor: "rgba(60, 69, 125, 0)",
            borderColor: "rgba(60, 69, 125, 0.5)",
            showLine:
              this.state.showLine || this.props.steppedLine ? true : false,
            radius: this.props.steppedLine ? 0 : 2
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

    const chartOptions = {
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

    const minValue = this.getMinValue(attribute);
    const description = `min_loss: ${minValue}`;
    const controls = (
      <div>
        <input
          type="checkbox"
          id="customShowLine"
          checked={this.state.showLine ? "checked" : ""}
          onChange={this.toggleShowLine}
        />
        <label for="customShowLine">Show line</label>
      </div>
    );

    return (
      <div className="col-md-3">
        <span>
          <b>{title}</b>:&nbsp;{this.getValue(attribute)}
        </span>
        <Line
          data={this.getChartData(attribute)}
          legend={{ display: false }}
          options={chartOptions}
        />
        <span>
          {description} {controls}
        </span>
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