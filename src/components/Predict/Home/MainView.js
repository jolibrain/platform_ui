import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";
import ServiceList from "./ServiceList";

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
            <ServiceList />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
