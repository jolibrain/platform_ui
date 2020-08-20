import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

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
              <button type="button" className="btn btn-outline-dark">
                <i className="fas fa-spinner fa-spin" /> loading...
              </button>
            </p>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
