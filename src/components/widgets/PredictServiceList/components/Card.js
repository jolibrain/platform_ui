/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";

import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import DownloadModelFiles from "../../DownloadModelFiles";

import stores from "../../../../stores/rootStore";

const Card = withRouter(observer(class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      creatingService: false,
      benchmarkSelected: false
    };

    this.openAddServiceModal = this.openAddServiceModal.bind(this);
    this.toggleBenchmarkState = this.toggleBenchmarkState.bind(this);
  }

  openAddServiceModal() {
    const { modalStore } = stores;
    const { repository } = this.props;
    modalStore.setVisible("addService", true, {
      repository: repository
    });
  }

  toggleBenchmarkState() {
    const { repository } = this.props;
    this.setState({ benchmarkSelected: !this.state.benchmarkSelected });
    this.props.handleBenchmarkStateChange(repository.path);
  }

  render() {
    const { repository } = this.props;

    if (!repository) return null;

    let modelValues = null;
    if (repository.bestModel) {
      modelValues = (
        <div className="content row pt-2 pl-2">
          {Object.keys(repository.bestModel).map((k, i) => {
            let attrTitle =
              i === 0
                ? k.replace(/\b\w/g, l => l.toUpperCase())
                : k.toUpperCase();

            if (attrTitle === "MEANIOU") attrTitle = "Mean IOU";

            return (
              <div key={i} className="col-6">
                <h3>{repository.bestModel[k]}</h3>
                <h4>{attrTitle}</h4>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="col-lg-4 col-md-12 my-2">
        <div className="card">
          <div
            className={
              modelValues !== null ? "card-body hasBestModel" : "card-body"
            }
          >
            <h5 className="card-title">
              <span className="title">
                <i className="fas fa-archive" /> {repository.name}
              </span>
            </h5>

            <h6 className="card-subtitle text-muted">
              <span className="title">
                {repository.jsonConfig &&
                repository.jsonConfig.description &&
                repository.jsonConfig.description.length > 0
                  ? repository.jsonConfig.description
                  : " "}
              </span>
            </h6>

            <div className="row process-icons">
              <div className="col-12">
                <i className={`fas fa-tag ${repository.store.name}`} />{" "}
                {repository.trainingTags.join(", ")}
              </div>
              {repository.metricsDate ? (
                <div className="col-12">
                  <i className="far fa-clock" />{" "}
                  {moment(repository.metricsDate).format("L LT")}
                </div>
              ) : (
                ""
              )}
              <div className="col-12">
                <i className="fas fa-folder" /> {repository.path}
              </div>
            </div>

            <DownloadModelFiles repository={repository} hidePath />
            {modelValues}
          </div>

          <div className="card-footer text-right">
            {repository.benchmarks.length > 0 ? (
              <a
                onClick={this.toggleBenchmarkState}
                className={
                  this.state.benchmarkSelected
                    ? "btn btn-benchmark-selected mr-1"
                    : "btn btn-benchmark mr-1"
                }
              >
                {this.state.benchmarkSelected ? (
                  <span>
                    <i className="fas fa-chart-line" /> Selected
                  </span>
                ) : (
                  <span>
                    <i className="far fa-square" /> Benchmark
                  </span>
                )}
              </a>
            ) : null}
            <button
              className="btn btn-primary"
              onClick={this.openAddServiceModal}
            >
              <i className="fas fa-plus" />
              &nbsp; Add Service
            </button>
          </div>
        </div>
      </div>
    );
  }
}));
export default Card;
