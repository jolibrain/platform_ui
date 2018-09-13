import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceCardList from "../../widgets/ServiceCardList";
import RightPanel from "../commons/RightPanel";

@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterServiceName: null
    };

    this.handleServiceFilter = this.handleServiceFilter.bind(this);
    this.cleanServiceFilter = this.cleanServiceFilter.bind(this);
  }

  handleServiceFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanServiceFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  render() {
    if (!this.props.deepdetectStore.isReady) return null;

    const { trainingServices } = this.props.deepdetectStore;
    const { archivedTrainingRepositories } = this.props.modelRepositoriesStore;

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
            <div className="serviceList archive">
              <h4>Archived Training Jobs</h4>

              <div className="input-group">
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
              <ServiceCardList
                filterServiceName={this.state.filterServiceName}
                services={archivedTrainingRepositories}
              />
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
