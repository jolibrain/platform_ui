import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";

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

            <p>
              <Link to="/predict" className="btn btn-outline-primary">
                <i className="fas fa-cube" /> Add Predict Service
              </Link>
              &nbsp;
              <Link to="/training" className="btn btn-outline-primary">
                <i className="fas fa-braille" /> Monitor Training Jobs
              </Link>
            </p>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
