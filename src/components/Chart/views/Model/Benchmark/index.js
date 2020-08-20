import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../../../commons/RightPanel";

import MultiTitle from "../../../../widgets/Benchmark/components/MultiTitle";
import BenchmarkChart from "../../../../widgets/Benchmark/components/BenchmarkChart";

@inject("modelRepositoriesStore")
@observer
@withRouter
export default class ModelBenchmark extends React.Component {
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
    let indexes = [...this.state.hiddenRepositoryIndexes];

    if (indexes.includes(index)) {
      indexes.splice(indexes.indexOf(index), 1);
      this.setState({ hiddenRepositoryIndexes: indexes });
    } else {
      this.setState({ hiddenRepositoryIndexes: [...indexes, index] });
    }
  }

  async componentWillMount() {
    const { match, modelRepositoriesStore } = this.props;
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
    const { repositories, hiddenRepositoriesIndexes, error } = this.state;

    const visibleRepositories = repositories.map((repository, index) => {
      return hiddenRepositoriesIndexes.includes(index) ? null : repository;
    });

    return (
      <div className="main-view content-wrapper">
        {repositories.length > 0 ? (
          <div className="fluid-container">
            <MultiTitle
              services={repositories}
              hiddenRepositoriesIndexes={hiddenRepositoriesIndexes}
              handleRepositoryVisibility={this.handleRepositoryVisibility}
            />
            <div className="content p-4">
              <BenchmarkChart services={visibleRepositories} />
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
                    <i className="fas fa-circle-notch fa-spin" /> loading
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
}
