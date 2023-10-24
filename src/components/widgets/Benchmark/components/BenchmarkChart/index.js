import React from "react";

import BatchSizeChart from "./ChartTypes/BatchSizeChart";
import FpsChart from "./ChartTypes/FpsChart";

class BenchmarkChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: "col-md-6"
    };

    this.selectedLayout = this.selectLayout.bind(this);
  }

  selectLayout(layout) {
    this.setState({ layout: layout });
  }

  render() {
    let benchmarkCharts = [];

    const { layout } = this.state;

    benchmarkCharts.push(<BatchSizeChart
                           key="batchSizeChart"
                           layout={layout}
                           {...this.props} />);

    benchmarkCharts.push(<FpsChart
                           key="fpsChart"
                           layout={layout}
                           {...this.props} />);

    return (
      <div>
        <div className="benchmarkchart-layout row">
          <i
            className={`text-right fa fa-stop ${
              layout === "col-md-12" ? "selected-layout" : ""
            }`}
            onClick={() => this.selectLayout("col-md-12")}
          />
          <i
            className={`text-right fa fa-th-large ${
              layout === "col-md-6" ? "selected-layout" : ""
            }`}
            onClick={() => this.selectLayout("col-md-6")}
          />
        </div>
        <div className="benchmarkchart-generalinfo row charts">
          {benchmarkCharts}
        </div>
      </div>
    );
  }
}
export default BenchmarkChart;
