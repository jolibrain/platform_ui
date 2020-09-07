/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";

import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import DownloadModelFiles from "../../DownloadModelFiles";

@inject("modalStore")
@withRouter
@observer
class Card extends React.Component {
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
    const { modalStore, repository } = this.props;
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

            <h6 className="card-subtitle mb-2 text-muted">
              {repository.jsonConfig &&
              repository.jsonConfig.description &&
              repository.jsonConfig.description.length > 0
                ? repository.jsonConfig.description
                : " "}
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
                    ? "btn btn-benchmark-selected mx-2"
                    : "btn btn-benchmark mx-2"
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
}

Card.propTypes = {
  repository: PropTypes.object.isRequired
};
export default Card;
