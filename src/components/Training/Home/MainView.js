import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

import MainViewServiceList from "../../widgets/MainViewServiceList";
import RightPanel from "../commons/RightPanel";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@inject("configStore")
@inject("gpuStore")
@withRouter
@observer
class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterServiceName: "",
      selectedComparePath: [],
      archiveLayout: "list",
      filteredPath: []
    };

    this.handleServiceFilter = this.handleServiceFilter.bind(this);
    this.cleanServiceFilter = this.cleanServiceFilter.bind(this);

    this.handleClickRefreshArchive = this.handleClickRefreshArchive.bind(this);

    this.handleCompareStateChange = this.handleCompareStateChange.bind(this);
    this.handlePathFilter = this.handlePathFilter.bind(this);
    this.removeFilteredPath = this.removeFilteredPath.bind(this);

    this.handleClickArchiveLayoutCard = this.handleClickArchiveLayoutCard.bind(this);
    this.handleClickArchiveLayoutList = this.handleClickArchiveLayoutList.bind(this);
  }

  componentWillMount() {
    const { modelRepositoriesStore } = this.props;
    if (!modelRepositoriesStore.isReadyTraining) {
      modelRepositoriesStore.refreshTraining();
    }
  }

  handleCompareStateChange(paths = []) {
    // Copy array of selectedComparePath
    let selectedComparePath = [...this.state.selectedComparePath];

    paths.forEach(path => {
      if (selectedComparePath.includes(path)) {
        // delete existing path
        selectedComparePath.splice(selectedComparePath.indexOf(path), 1);
      } else {
        // append new path
        selectedComparePath.push(path)
      }
    })

    this.setState({ selectedComparePath: selectedComparePath });
  }

  handlePathFilter(filter) {

    if(!this.state.filteredPath.includes(filter))
      this.setState({
        filteredPath: [...this.state.filteredPath, filter]
      })

  }

  removeFilteredPath(filter) {
    let newFilteredPath = [...this.state.filteredPath]
    newFilteredPath.splice(newFilteredPath.indexOf(filter), 1)
    this.setState({filteredPath: newFilteredPath})
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

  handleClickArchiveLayoutCard() {
    this.setState({ archiveLayout: "card" });
  }

  handleClickArchiveLayoutList() {
    this.setState({ archiveLayout: "list" });
  }

  render() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;

    if (!deepdetectStore.isReady) return null;

    const { filterServiceName, filteredPath } = this.state;

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
//    const displayedTrainingServicesPath = displayedTrainingServices.map(
//      service => {
//        return service.respInfo &&
//          service.respInfo.body &&
//          service.respInfo.body.repository
//          ? service.respInfo.body.repository
//              .replace("/opt/platform/models/training/", "")
//              .replace(/\/$/g, "")
//          : "";
//      }
//    );

    const { archivedTrainingRepositories } = modelRepositoriesStore;

    const displayedArchiveRepositories = archivedTrainingRepositories
      .filter(r => {

        // Filter based on input form
        // and existing path in currently training jobs

        const filteredByServiceNameInput = filterServiceName.length === 0 ||
              r.name.includes(filterServiceName);

        const filteredByPathTag = filteredPath.length === 0 ||
              filteredPath.every(item => {
                return r.path.split("/").includes(item);
              });

        return filteredByServiceNameInput && filteredByPathTag;
      })
      .slice()
      .sort((a, b) => {
        return moment
          .utc(b.metricsDate ? b.metricsDate : 1)
          .diff(moment.utc(a.metricsDate ? a.metricsDate : 1));
      });

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof this.props.configStore.gpuInfo !== "undefined" &&
        this.props.gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
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
                    value={filterServiceName}
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
              <MainViewServiceList
                services={displayedTrainingServices}
              />
            </div>

            <hr />

            <div className="row">
              <div className="col-10">
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
              </div>
              <div className="col-2 layout-select">
                <i
                  className={ this.state.archiveLayout === "card" ?
                              "fas fa-th-large active"
                              :
                              "fas fa-th-large"
                            }
                  onClick={this.handleClickArchiveLayoutCard}
                />
                <i
                  className={ this.state.archiveLayout === "list" ?
                              "fas fa-th-list active"
                              :
                              "fas fa-th-list"
                            }
                  onClick={this.handleClickArchiveLayoutList}
                />
              </div>
            </div>

            <div className="archiveTrainingList archive">
              <div className="filterPath-list">
              {
                filteredPath.map((item, i) => {
                  return <span
                           key={i}
                           className="badge badge-dark"
                  onClick={this.removeFilteredPath.bind(this, item)}
                         >
                    <i className="fas fa-times"></i> {item}
                  </span>
                })

              }
              </div>
              <MainViewServiceList
                layout={this.state.archiveLayout}
                services={displayedArchiveRepositories}
                handleCompareStateChange={this.handleCompareStateChange}
                handlePathFilter={this.handlePathFilter}
                selectedComparePath={this.state.selectedComparePath}
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
