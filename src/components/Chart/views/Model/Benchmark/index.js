import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import RightPanel from "../../../commons/RightPanel";

import MultiTitle from "../../../../widgets/Benchmark/components/MultiTitle";
import BenchmarkChart from "../../../../widgets/Benchmark/components/BenchmarkChart";

import stores from "../../../../../stores/rootStore";

const ModelBenchmark = withRouter(observer(class ModelBenchmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repositories: [],
      hiddenRepositoriesIndexes: [],
      error: null
    };

    this.handleRepositoryVisibility = this.handleRepositoryVisibility.bind(
      this
    );
  }

  handleRepositoryVisibility(index) {
    let indexes = [...this.state.hiddenRepositoriesIndexes];

    if (indexes.includes(index)) {
      indexes.splice(indexes.indexOf(index), 1);
      this.setState({ hiddenRepositoriesIndexes: indexes });
    } else {
      this.setState({ hiddenRepositoriesIndexes: [...indexes, index] });
    }
  }

  async componentWillMount() {
    const { match } = this.props;
    const { modelRepositoriesStore } = stores;
    const benchmarkRepositories = modelRepositoriesStore.predictRepositories.filter(
      r => r.benchmarks.length > 0
    );

    try {
      let repositories = [];
      let paths = match.params.chartParams.split("+");

      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];

        // Sanitize path
        if (!path.startsWith("/")) path = "/" + path;
        if (!path.endsWith("/")) path = path + "/";

        let benchmarkRepository = benchmarkRepositories.find(
          r => r.path === path
        );
        if (!benchmarkRepository) {
          benchmarkRepository = await modelRepositoriesStore.findAndLoad(path);
        }

        repositories.push(benchmarkRepository);
      }

      this.setState({ repositories: repositories });
    } catch (err) {
      this.setState({
        error: `Error while mounting BenchmarkCompare chart - ${err}`
      });
    }
  }

  render() {

    const { configStore, gpuStore } = stores;

    const {
      repositories,
      hiddenRepositoriesIndexes,
      error
    } = this.state;

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof configStore.gpuInfo !== "undefined" &&
        gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        {repositories.length > 0 ? (
          <div className="fluid-container">
            <MultiTitle
              services={repositories}
              hiddenRepositoriesIndexes={hiddenRepositoriesIndexes}
              handleRepositoryVisibility={this.handleRepositoryVisibility}
            />
            <div className="content p-4">
              <BenchmarkChart
                services={repositories}
                hiddenRepositoriesIndexes={hiddenRepositoriesIndexes}
              />
            </div>
            <RightPanel />
          </div>
        ) : (
          <div className="fluid-container">
            <div className="content p-4">
              <p>
                {error ? (
                  <span>
                    <i className="fas fa-exclamation-circle" /> {error}
                  </span>
                ) : (
                  <button type="button" className="btn btn-outline-dark">
                    <i className="fas fa-spinner fa-spin" /> loading
                    benchmarks...
                  </button>
                )}
              </p>
            </div>
            <RightPanel />
          </div>
        )}
      </div>
    );
  }
}));
export default ModelBenchmark;
