import React from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { toJS } from "mobx";
import { Line } from "react-chartjs-2";

@observer
export default class MeasureChart extends React.Component {
  render() {
    const { title, attribute, service } = this.props;

    let measure,
      measure_hist = null;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.respTraining.body.measure;
      measure_hist = service.respTraining.body.measure_hist;
    }

    let chartData = {};
    if (
      measure_hist &&
      measure_hist[`${attribute}_hist`] &&
      measure_hist[`${attribute}_hist`].length > 0
    ) {
      const measures = toJS(measure_hist[`${attribute}_hist`]);
      chartData = {
        labels: Array.apply(null, Array(measures.length)),
        datasets: [
          {
            data: measures.map(x => (x ? x.toFixed(3) : null)),
            fill: false,
            lineTension: 0,
            steppedLine: this.props.steppedLine,
            backgroundColor: "rgba(60, 69, 125, 0)",
            borderColor: "rgba(60, 69, 125, 0.5)",
            showLine: this.props.steppedLine ? true : false,
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

    let value = "--";

    if (measure && measure[attribute]) {
      value = measure[attribute];
    } else if (
      measure_hist &&
      measure_hist[`${attribute}_hist`] &&
      measure_hist[`${attribute}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attribute}_hist`][
          measure_hist[`${attribute}_hist`].length - 1
        ];
    }

    if (attribute === "train_loss" && value !== "--") {
      value = value.toFixed(10);
    } else {
      value = value.toFixed(5);
    }

    return (
      <div className="col-md-3">
        <span>
          <b>{title}</b>:&nbsp;{value}
        </span>
        {chartData.datasets ? (
          <Line
            data={chartData}
            legend={{ display: false }}
            options={chartOptions}
          />
        ) : (
          ""
        )}
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
