import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";

import ServiceCardList from "../../widgets/ServiceCardList";
import PredictServiceList from "../../widgets/PredictServiceList";

@inject("modelRepositoriesStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterServiceName: "",
      predictLayout: "cards"
    };

    this.handleServiceFilter = this.handleServiceFilter.bind(this);
    this.cleanServiceFilter = this.cleanServiceFilter.bind(this);

    this.handleClickLayoutCards = this.handleClickLayoutCards.bind(this);
    this.handleClickLayoutList = this.handleClickLayoutList.bind(this);

    this.handleClickRefreshServices = this.handleClickRefreshServices.bind(
      this
    );
  }

  handleClickRefreshServices() {
    this.props.modelRepositoriesStore.refresh();
  }

  handleServiceFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanServiceFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  handleClickLayoutCards() {
    this.setState({ predictLayout: "cards" });
  }

  handleClickLayoutList() {
    this.setState({ predictLayout: "list" });
  }

  render() {
    const { predictServices } = this.props.deepdetectStore;

    let {
      publicRepositories,
      privateRepositories
    } = this.props.modelRepositoriesStore;

    if (
      this.state.filterServiceName &&
      this.state.filterServiceName.length > 0
    ) {
      publicRepositories = publicRepositories.filter(r => {
        return r.name.includes(this.state.filterServiceName);
      });

      privateRepositories = privateRepositories.filter(r => {
        return r.name.includes(this.state.filterServiceName);
      });
    }

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <Link to="/predict/new" className="btn btn-outline-primary">
              New Service
            </Link>

            <hr />

            <div className="serviceList">
              <h4>Current Predict Service</h4>
              <ServiceCardList services={predictServices} />
            </div>

            <hr />

            <div className="predictServiceList">
              <div className="float-right">
                <form className="serviceCreate form-inline">
                  <button
                    onClick={this.handleClickRefreshServices}
                    type="button"
                    className="btn btn-primary"
                    id="refreshServices"
                  >
                    <i
                      className={
                        this.props.modelRepositoriesStore.isRefreshing
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
                        this.state.predictLayout === "cards"
                          ? "fas fa-th-large active"
                          : "fas fa-th-large"
                      }
                      onClick={this.handleClickLayoutCards}
                    />
                    <i
                      className={
                        this.state.predictLayout === "list"
                          ? "fas fa-th-list active"
                          : "fas fa-th-list"
                      }
                      onClick={this.handleClickLayoutList}
                    />
                  </div>
                </form>
              </div>

              <h4>Available Predict Service</h4>

              <PredictServiceList
                services={publicRepositories}
                layout={this.state.predictLayout}
              />

              <PredictServiceList
                services={privateRepositories}
                layout={this.state.predictLayout}
              />
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
