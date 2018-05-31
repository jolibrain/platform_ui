import React from "react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";

@withRouter
export default class MainView extends React.Component {
  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <h2>DeepDetect Platform</h2>

            <p>
              Welcome to <b>DeepDetect Platform</b>
            </p>
            <Link to="/predict/new" className="btn btn-outline-primary">
              New Service
            </Link>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
