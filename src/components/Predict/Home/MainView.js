import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import ServiceCardList from "../../widgets/ServiceCardList";
import ServiceCardCreate from "../../widgets/ServiceCardCreate";

@inject("deepdetectStore")
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
    const { predictServices } = this.props.deepdetectStore;

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
            <div className="serviceCreate">
              <h4>Available Predict Service</h4>

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

              <ServiceCardCreate
                filterServiceName={this.state.filterServiceName}
              />
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
