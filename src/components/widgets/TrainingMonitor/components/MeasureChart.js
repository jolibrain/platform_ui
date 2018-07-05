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
      chartData = {
        datasets: [
          {
            data: toJS(measureHist[`${attribute}_hist`]),
            fill: false
          }
        ]
      };
    }

    return (
      <div>
        <span>
          <b>{title}</b>:&nbsp;
          {measure[attribute] ? measure[attribute].toFixed(3) : "--"}
        </span>
        {chartData.datasets ? (
          <Line data={chartData} legend={{ display: false }} />
        ) : (
          ""
        )}
      </div>
    );
  }
}
