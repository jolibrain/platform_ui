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
            <div className="row justify-content-center">
              <h2>{homeComponent.title}</h2>
            </div>

            <div className="row justify-content-center">
              <div className="description text-center">
                {homeComponent.description.map((line, index) => {
                  return <p key={index}>{line}</p>;
                })}
              </div>
            </div>

            <div className="row sections p-4">
              <div className="col-lg-3 col-md-6 mb-4">
                <i className="fas fa-save title-icon" />
                <h3>Data Upload</h3>
                <p>Upload your data to use them in your training jobs.</p>
                <a href="/filebrowser">
                  Upload files <i className="fas fa-chevron-right" />
                </a>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <i className="fas fa-circle-notch title-icon" />
                <h3>Jupyter Notebooks</h3>
                <p>Start new training jobs from Jupyter notebooks.</p>
                <a href="/code/lab">
                  Create notebooks <i className="fas fa-chevron-right" />
                </a>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <i className="fas fa-braille title-icon" />
                <h3>Training services</h3>
                <p>
                  Monitor training jobs, and publish archive as a predict
                  service.
                </p>
                <a href="/#/training">
                  Monitor training jobs <i className="fas fa-chevron-right" />
                </a>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <i className="fas fa-cube title-icon" />
                <h3>Predict services</h3>
                <p>Create and use predict services to test your models.</p>
                <a href="/#/predict">
                  Use predict services <i className="fas fa-chevron-right" />
                </a>
              </div>
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
