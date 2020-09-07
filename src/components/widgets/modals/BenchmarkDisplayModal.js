import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { Line } from "react-chartjs-2";

@inject("deepdetectStore")
@inject("modalStore")
@observer
@withRouter
class BenchmarkDisplayModale extends React.Component {
  chartReference = {};

  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      serviceName: "",
      benchmarks: [],
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

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ benchmarks: [], serviceName: "" });
    this.props.modalStore.setVisible("benchmarkDisplay", false);
  }

  componentWillReceiveProps(nextProps) {
    const { repository } = nextProps;

    if (!repository) return null;

    this.setState({
      serviceName: repository.name,
      benchmarks: repository.benchmarks
    });
  }

  getChartData(benchmarks) {}

  render() {
    const { serviceName, benchmarks } = this.state;

    const chartData = {
      labels: benchmarks.map(b => b.name),
      datasets: benchmarks.map((b, index) => {
        return {
          label: b.name,
          data: b.benchmark.map(d => d.mean_processing_time / d.batch_size),
          fill: false,
          lineTension: 0,
          spanGaps: true,
          backgroundColor: this.state.colors.dark[index],
          borderColor: this.state.colors.dark[index],
          order: index
        };
      })
    };

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
            scaleLabel: {
              display: true,
              labelString: "batch size"
            },
            ticks: {
              callback: function(value, index, values) {
                return Math.pow(2, index);
              }
            }
          }
        ],
        yAxes: [
          {
            type: "logarithmic",
            scaleLabel: {
              display: true,
              labelString: "log of time per image (ms)"
            },
            ticks: {
              callback: function(value, index, values) {
                return parseInt(value, 10);
              }
            }
          }
        ]
      }
    };

    return (
      <div id="modal-addService">
        <div className="modal-header">
          <h5 className="modal-title">Benchmarks - {serviceName}</h5>
        </div>

        <div className="modal-body">
          <Line
            data={chartData}
            options={chartOptions}
            ref={reference => (this.chartReference = reference)}
          />
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-outline-primary mb-2"
            onClick={this.handleClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}
export default BenchmarkDisplayModale;
