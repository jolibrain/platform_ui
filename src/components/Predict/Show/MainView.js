import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import Imaginate from "../../widgets/Imaginate";
import Breadcrumb from "../../widgets/Breadcrumb";
import DownloadModelFiles from "../../widgets/DownloadModelFiles";

@inject("imaginateStore")
@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@inject("modalStore")
@withRouter
@observer
export default class MainView extends React.Component {
  componentWillMount() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;
    if (!deepdetectStore.isReady) return null;

    const { server, service } = deepdetectStore;

    if (!server || !service) {
      this.props.history.push("/");
    }

    if (!modelRepositoriesStore.isReadyPredict) {
      modelRepositoriesStore.refreshPredict();
    }
  }

  render() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;
    if (!deepdetectStore.isReady) return null;

    const { server, service } = deepdetectStore;
    if (!server || !service) return null;

    const { settings } = service;

    // Do not display name, description and boolean values
    const settingInfoKeys = Object.keys(settings).filter(key => {
      return (
        !["name", "description"].includes(key) &&
        typeof settings[key] !== "boolean"
      );
    });

    const repository = modelRepositoriesStore.predictRepositories.find(
      r => r.name === service.name
    );

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-8 col-md-12">
              <h3>
                <i className="fas fa-cube" /> {service.name}
              </h3>
              <h4>{settings.description}</h4>

              {settingInfoKeys.map((key, index) => {
                let value = settings[key];
                if (typeof settings[key] === "object")
                  value = JSON.stringify(value);

                return (
                  <div key={index} className="row serviceInfo">
                    <h4>{value}</h4>
                    <h5>{key}</h5>
                  </div>
                );
              })}
            </div>

            <div className="col-lg-4 col-md-12">
              {repository ? <DownloadModelFiles repository={repository} /> : ""}
            </div>
          </div>

          <div className="predict-breadcrumb px-4 py-2">
            <Breadcrumb service={service} />
          </div>

          <div className="content p-4">
            <Imaginate />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
