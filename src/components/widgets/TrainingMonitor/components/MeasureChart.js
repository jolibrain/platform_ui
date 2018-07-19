import React from "react";
import { toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Line } from "react-chartjs-2";

@inject("deepdetectStore")
@observer
export default class MeasureChart extends React.Component {
  render() {
    const { server } = this.props.deepdetectStore;

    if (!server.service) return null;

    const measure = server.service.trainMeasure;
    const measureHist = server.service.trainMeasureHist;

    const { title, attribute } = this.props;

    let chartData = {};
    if (measureHist && measureHist[`${attribute}_hist`]) {
      const measures = measureHist[`${attribute}_hist`];
      chartData = {
        labels: Array.apply(null, Array(measures.length)),
        datasets: [
          {
            data: toJS(measures).map(x => (x ? x.toFixed(3) : null)),
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

    return (
      <div>
        <span>
          <b>{title}</b>:&nbsp;
          {measure[attribute] ? measure[attribute].toFixed(3) : "--"}
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
