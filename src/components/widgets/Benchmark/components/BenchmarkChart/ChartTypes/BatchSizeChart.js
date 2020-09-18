import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Line } from "react-chartjs-2";

@observer
class BatchSizeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
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
          "hsl(210, 22%, 49%)",
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

    this.buildDataset = this.buildDataset.bind(this);
  }

  buildDataset(benchmark, index) {
    const data = benchmark.benchmark.map(d => {
        return {
          x: d.batch_size,
          y: d.mean_processing_time / d.batch_size,
        }
    });

    return {
      label: benchmark.name,
      data: data,
      fill: false,
      lineTension: 0,
      spanGaps: true,
      backgroundColor: this.state.colors.dark[index],
      borderColor: this.state.colors.dark[index],
      order: index
    };
  }

  render() {
    const {
      services,
      hiddenRepositoriesIndexes
    } = this.props;

    if (!services || services.length === 0) return null;

    const visibleBenchmarks = services.filter((s, index) => {
      return s && !hiddenRepositoriesIndexes.includes(index)
    })
    .map(s => s.benchmarks)
    .flat();

    const labels = visibleBenchmarks.map(b => b.name);
    const datasets = visibleBenchmarks.map(this.buildDataset);

    const chartData = {
      labels: labels,
      datasets: datasets
    };

    let chartOptions = {
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
              labelString: "batch size"
            }
          }
        ],
        yAxes: [
          {
            type: 'logarithmic',
            display: true,
            scaleLabel: {
              display: true,
              labelString: "log of time per image (ms)"
            }
          }
        ]
      }
    };

    return (
      <div className={`benchmarkchart-batchsize ${this.props.layout}`}>
        <Line
          data={chartData}
          options={chartOptions}
        />
      </div>
    );
  }
}

BatchSizeChart.propTypes = {
  services: PropTypes.array.isRequired,
  hiddenRepositoriesIndexes: PropTypes.array
};
export default BatchSizeChart;
