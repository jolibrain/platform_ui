import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import RightPanel from "./RightPanel";

@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <Link to="/training/new" className="btn btn-outline-primary">
              New Service
            </Link>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
