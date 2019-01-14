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
          <div className="content text-center">
            <h2>{homeComponent.title}</h2>
            {homeComponent.description.map((line, index) => {
              return <p key={index}>{line}</p>;
            })}

            <p className="buttons">
              <Link to="/predict" className="btn btn-outline-primary mr-4">
                <i className="fas fa-cube" /> Add Predict Service
              </Link>
              <Link to="/training" className="btn btn-primary">
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
