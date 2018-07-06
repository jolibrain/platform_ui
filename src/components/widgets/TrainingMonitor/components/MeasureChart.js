import React from "react";
import { toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Line } from "react-chartjs-2";

@inject("deepdetectStore")
@observer
export default class MeasureChart extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const measure = service.trainMeasure;
    const measureHist = service.trainMeasureHist;

    const { title, attribute } = this.props;

    let chartData = {};
    if (measureHist && measureHist[`${attribute}_hist`]) {
      const measures = measureHist[`${attribute}_hist`];
      chartData = {
        labels: Array.apply(null, Array(measures.length)),
        datasets: [
          {
            data: toJS(measures).map(x => x.toFixed(3)),
            fill: false,
            lineTension: 0,
            steppedLine: this.props.steppedLine
          }
        ]
      };
    }

    console.log(attribute + ": " + chartData.datasets[0].data.length);

    const chartOptions = {
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
