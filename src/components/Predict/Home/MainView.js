import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";
import ServiceCardList from "../../widgets/ServiceCardList";
import ServiceCardCreate from "../../widgets/ServiceCardCreate";

@inject("configStore")
@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    const { homeComponent } = this.props.configStore;

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <h2>{homeComponent.title}</h2>
            <p>{homeComponent.description}</p>
            <Link to="/predict/new" className="btn btn-outline-primary">
              New Service
            </Link>
            <div className="serviceList">
              <h4>Current Predict Service</h4>
              <ServiceCardList />
            </div>
            <div className="serviceCreate">
              <h4>Available Predict Service</h4>
              <ServiceCardCreate />
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
