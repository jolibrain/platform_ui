import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Line } from "react-chartjs-2";

@observer
class ChartColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: {
          target: "rgba(27,158,119,1)",
          prediction: "rgba(217,95,2,1)"
      }
    };

    this.buildTargetDataset = this.buildTargetDataset.bind(this);
    this.buildPredictionDataset = this.buildPredictionDataset.bind(this);
  }

  buildTargetDataset() {
    const { input, colKey } = this.props;
    const data = input.csv.data.map((r, index) => {
        return {
            x: parseInt(input.csv.data[index]["timestamp"]),
            y: r[colKey]
        };
    });

    return {
      label: "target",
      data: data,
      fill: false,
      lineTension: 0,
      spanGaps: true,
      backgroundColor: this.state.colors.target,
      borderColor: this.state.colors.target,
      order: 0
    };
  }

  buildPredictionDataset() {
    const { input, colIndex, colKey } = this.props;
    let data = [];

    if (
    input &&
        input.json &&
        input.json.body &&
        input.json.body.predictions &&
        input.json.body.predictions[0] &&
        input.json.body.predictions[0].series
    ) {
        data = input.json.body.predictions[0].series.map((s, index) => {
            return {
                x: parseInt(input.csv.data[index]["timestamp"]),
                y: input.csv.data[index][colKey] * (1 + s.out[colIndex])
            }
        })
    }

    return {
      label: "prediction",
      data: data,
      fill: false,
      lineTension: 0,
      spanGaps: true,
      backgroundColor: this.state.colors.prediction,
      borderColor: this.state.colors.prediction,
      order: 1
    };
  }

  render() {

    const { input, colKey } = this.props;

    if (
        !input ||
            !input.csv ||
            !input.csv.data
    ) {
        return null;
    }

    const chartData = {
      labels: ["target", "prediction"],
      datasets: [
          this.buildTargetDataset(),
          this.buildPredictionDataset()
      ]
    };

    let chartOptions = {
      title: {
          display: true,
          text: `Column: ${colKey}`
      },
      animation: {
        duration: 0
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [
          {
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Time"
            },
            ticks: {
                beginAtZero: false,
                min: chartData &&
                    chartData.datasets &&
                    chartData.datasets[0] &&
                    chartData.datasets[0].data &&
                    chartData.datasets[0].data[0] &&
                    chartData.datasets[0].data[0].x ?
                    chartData.datasets[0].data[0].x
                : 0
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Amplitude"
            }
          }
        ]
      }
    };

    return (
      <div
        className="row chartcolumn"
      >
        <Line
          data={chartData}
          options={chartOptions}
        />
      </div>
    );
  }
}

ChartColumn.propTypes = {
  input: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  colKey: PropTypes.string.isRequired
};
export default ChartColumn;
