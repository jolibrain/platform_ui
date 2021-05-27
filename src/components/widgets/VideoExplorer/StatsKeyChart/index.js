import React from "react";
import { inject, observer } from "mobx-react";

import { Bar } from "react-chartjs-2";

import 'chartjs-plugin-zoom';

@inject("configStore")
@observer
class StatsKeyChart extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("DistributionChart"))
      return null;

    const { stats, options } = this.props;
    const statKey = options.key;

    if(
        typeof stats === "undefined" ||
        typeof stats[statKey] === "undefined"
    )
        return null;

    const data = stats[statKey]
    const dataKeys = Object.keys(data)
                           .sort((a, b) => parseInt(a) - parseInt(b))

    let values = dataKeys.map(k => data[k]);
    if(options.valueFormat) {
      switch(options.valueFormat) {
          case 'percent':
            values = dataKeys
            .map(k => (data[k] * 100).toFixed(2));
            break;
          default:
            break;
      }
    }

    const chartData = {
      labels: dataKeys.map(k => parseInt(k)),
      datasets: [
        {
          data: values,
          backgroundColor: options.chartColors ?
            options.chartColors : "rgba(55,126,184,1)"
        }
      ]
    }

    const chartOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };

    return (
      <div>
        <h5>{options.title}</h5>
        <Bar
          data={chartData}
          legend={{ display: false }}
          options={chartOptions}
          ref={reference => (this.chartReference = reference)}
        />
      </div>
    );
  }
}
export default StatsKeyChart;
