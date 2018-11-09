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
            <h2>{homeComponent ? homeComponent.title : ""}</h2>
            <p>{homeComponent ? homeComponent.description : ""}</p>

            <p>
              <a href="#" className="btn btn-outline-primary">
                <i className="fas fa-circle-notch fa-spin" /> loading...
              </a>
            </p>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
