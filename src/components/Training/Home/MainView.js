import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

import ServiceCardList from "../../widgets/ServiceCardList";
import RightPanel from "../commons/RightPanel";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterServiceName: "",
      selectedComparePath: []
    };

    this.handleServiceFilter = this.handleServiceFilter.bind(this);
    this.cleanServiceFilter = this.cleanServiceFilter.bind(this);

    this.handleClickRefreshArchive = this.handleClickRefreshArchive.bind(this);

    this.handleCompareStateChange = this.handleCompareStateChange.bind(this);
  }

  componentWillMount() {
    const { modelRepositoriesStore } = this.props;
    if (!modelRepositoriesStore.isReadyTraining) {
      modelRepositoriesStore.refreshTraining();
    }
  }

  handleCompareStateChange(path) {
    // Copy array of selectedComparePath
    let selectedComparePath = [...this.state.selectedComparePath];

    if (this.state.selectedComparePath.includes(path)) {
      // delete existing path
      selectedComparePath.splice(selectedComparePath.indexOf(path), 1);
      this.setState({ selectedComparePath: selectedComparePath });
    } else {
      // append new path
      this.setState({ selectedComparePath: [...selectedComparePath, path] });
    }
  }

  handleClickRefreshArchive() {
    this.props.modelRepositoriesStore.refreshTraining();
  }

  handleServiceFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanServiceFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  render() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;

    if (!deepdetectStore.isReady) return null;

    const { filterServiceName } = this.state;

    const { trainingServices } = deepdetectStore;
    const displayedTrainingServices = trainingServices
      .filter(r => r.name.includes(filterServiceName))
      .slice()
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

    // List of path to filter them out from displayed archive jobs
    const displayedTrainingServicesPath = displayedTrainingServices.map(
      service => {
        return service.respInfo &&
          service.respInfo.body &&
          service.respInfo.body.repository
          ? service.respInfo.body.repository
              .replace("/opt/platform/models/training/", "")
              .replace(/\/$/g, "")
          : "";
      }
    );

    const { archivedTrainingRepositories } = modelRepositoriesStore;
    const displayedArchiveRepositories = archivedTrainingRepositories
      .filter(r => {
        // Filter based on input form
        // and existing path in currently training jobs
        return (
          r.name.includes(filterServiceName) &&
          !displayedTrainingServicesPath.includes(
            r.path.replace("/models/training/", "").replace(/\/$/g, "")
          )
        );
      })
      .slice()
      .sort((a, b) => {
        return moment
          .utc(b.metricsDate ? b.metricsDate : 1)
          .diff(moment.utc(a.metricsDate ? a.metricsDate : 1));
      });

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-3 col-md-6">
              <h3>{trainingServices.length}</h3>
              <h4>
                <i className="fas fa-braille" /> Training Services
              </h4>
            </div>

            <div className="col-lg-3 col-md-6">
              <h3>
                {modelRepositoriesStore.isRefreshing ? (
                  <span>
                    <i className="fas fa-spinner fa-spin fa-xs" />{" "}
                  </span>
                ) : (
                  displayedArchiveRepositories.length
                )}
              </h3>

              <h4>
                <i className="fas fa-archive" /> Archived Jobs
              </h4>
            </div>

            <div className="col-lg-6 col-md-12 pb-2">
              <form className="form-inline">
                <button
                  id="refreshServices"
                  onClick={this.handleClickRefreshArchive}
                  type="button"
                  className="btn btn-primary"
                >
                  <i
                    className={
                      modelRepositoriesStore.isRefreshing
                        ? "fas fa-spinner fa-spin"
                        : "fas fa-sync"
                    }
                  />
                </button>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fas fa-search" />
                    </div>
                  </div>
                  <input
                    type="text"
                    onChange={this.handleServiceFilter}
                    placeholder="Filter service name..."
                    value={this.state.filterServiceName}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={this.cleanServiceFilter}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="content">
            <div className="serviceList current">
              <ServiceCardList services={displayedTrainingServices} />
            </div>

            <hr />
            <h3>
              <i className="fas fa-archive" /> Archived Jobs&nbsp;
              {modelRepositoriesStore.isRefreshing ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                ""
              )}
              {!modelRepositoriesStore.isRefreshing &&
              this.state.selectedComparePath.length > 1 ? (
                <Link
                  to={`/charts/archive/${this.state.selectedComparePath
                    .map(path => path.replace(/^\/+|\/+$/g, ""))
                    .join("+")}`}
                  className="btn btn-primary"
                  type="button"
                >
                  Compare Selected
                </Link>
              ) : null}
            </h3>

            <div className="archiveTrainingList archive">
              <ServiceCardList
                services={displayedArchiveRepositories}
                handleCompareStateChange={this.handleCompareStateChange}
              />
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
