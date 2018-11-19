import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import ServiceCardList from "../../widgets/ServiceCardList";
import ServiceContentList from "../../widgets/ServiceContentList";
import RightPanel from "../commons/RightPanel";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterServiceName: "",
      archiveLayout: "cards"
    };

    this.handleServiceFilter = this.handleServiceFilter.bind(this);
    this.cleanServiceFilter = this.cleanServiceFilter.bind(this);

    this.handleClickLayoutCards = this.handleClickLayoutCards.bind(this);
    this.handleClickLayoutList = this.handleClickLayoutList.bind(this);

    this.handleClickRefreshArchive = this.handleClickRefreshArchive.bind(this);
  }

  componentWillMount() {
    const { modelRepositoriesStore } = this.props;
    if (!modelRepositoriesStore.isReady) {
      modelRepositoriesStore.refresh();
    }
  }

  handleClickRefreshArchive() {
    this.props.modelRepositoriesStore.refresh();
  }

  handleServiceFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanServiceFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  handleClickLayoutCards() {
    this.setState({ archiveLayout: "cards" });
  }

  handleClickLayoutList() {
    this.setState({ archiveLayout: "list" });
  }

  render() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;

    if (!deepdetectStore.isReady) return null;

    const { trainingServices } = deepdetectStore;
    const { archivedTrainingRepositories } = modelRepositoriesStore;

    const { filterServiceName } = this.state;
    const displayedArchiveRepositories = archivedTrainingRepositories
      .filter(r => {
        return (
          r.name.includes(filterServiceName) ||
          r.trainingTags.join(" ").includes(filterServiceName)
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
          <div className="content">
            <div className="serviceList current">
              {trainingServices.length === 0 ? (
                <h4>No training service running</h4>
              ) : (
                <div>
                  <h4>Current Training Services</h4>
                  <ServiceCardList services={trainingServices} />
                </div>
              )}
            </div>

            <hr />

            <div className="archiveTrainingList archive">
              <div className="float-right">
                <form className="form-inline">
                  <button
                    id="refreshServices"
                    onClick={this.handleClickRefreshArchive}
                    type="button"
                    className="btn btn-outline-primary"
                  >
                    <i
                      className={
                        modelRepositoriesStore.isRefreshing
                          ? "fas fa-sync fa-spin"
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
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.cleanServiceFilter}
                      >
                        <i className="fas fa-times-circle" />
                      </button>
                    </div>
                  </div>

                  <div className="layoutSelect">
                    <i
                      className={
                        this.state.archiveLayout === "cards"
                          ? "fas fa-th-large active"
                          : "fas fa-th-large"
                      }
                      onClick={this.handleClickLayoutCards}
                    />
                    <i
                      className={
                        this.state.archiveLayout === "list"
                          ? "fas fa-th-list active"
                          : "fas fa-th-list"
                      }
                      onClick={this.handleClickLayoutList}
                    />
                  </div>
                </form>
              </div>

              <h4>Archived Training Jobs</h4>

              {this.state.archiveLayout === "cards" ? (
                <ServiceCardList services={displayedArchiveRepositories} />
              ) : (
                <ServiceContentList services={displayedArchiveRepositories} />
              )}
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
