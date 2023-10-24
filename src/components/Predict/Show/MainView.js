import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import Imaginate from "../../widgets/Imaginate";
import Breadcrumb from "../../widgets/Breadcrumb";
import DownloadModelFiles from "../../widgets/DownloadModelFiles";

import stores from "../../../stores/rootStore";

const MainView = withRouter(observer(class MainView extends React.Component {
  componentWillMount() {
    const { deepdetectStore, modelRepositoriesStore } = stores;
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
    const { configStore, deepdetectStore, gpuStore, modelRepositoriesStore } = stores;
    if (!deepdetectStore.isReady) return null;

    const { server, service } = deepdetectStore;
    if (!server || !service) return null;

    const { settings } = service;

    // filter out name, description, stats from displayed info
    const filteredOutInfo = [
      "name",
      "description",
      "stats",
      "parameters",
      "model_stats",
      "service_stats"
    ]

    // Do not display filtered-out fields and boolean values
    const settingInfoKeys = Object.keys(settings).filter(key => {
      return (
        !filteredOutInfo.includes(key) &&
        typeof settings[key] !== "boolean"
      );
    });

    // prepare service stats display
    let statsDisplay = null;
    if(
      settings.service_stats &&
        settings.service_stats.predict_success &&
        settings.service_stats.predict_count &&
        settings.service_stats.avg_predict_duration &&
        settings.service_stats.avg_transform_duration &&
        settings.service_stats.avg_batch_size
    ) {

      const {
        predict_success,
        predict_count,
        avg_predict_duration,
        avg_transform_duration,
        avg_batch_size
      } = settings.service_stats;

      statsDisplay = (<div className="serviceStats">
                              <div className="row serviceInfo">
                                <h4>{parseFloat(avg_batch_size).toFixed(2)}</h4>
                                <h5>Average Batch Size</h5>
                              </div>
                              <div className="row serviceInfo">
                                <h4>{parseFloat(avg_transform_duration).toFixed(3) * 1000}</h4>
                                <h5>Average Transform Duration (ms)</h5>
                              </div>
                              <div className="row serviceInfo">
                                <h4>{parseFloat(avg_predict_duration).toFixed(3) * 1000}</h4>
                                <h5>Average Predict Duration (ms)</h5>
                              </div>
                              <div className="row serviceInfo">
                                <h4>{predict_success} / {predict_count}</h4>
                                <h5>Predict success / total</h5>
                              </div>
                            </div>)
    }

    const repository = modelRepositoriesStore.predictRepositories.find(
      r => r.name === service.name
    );

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof configStore.gpuInfo !== "undefined" &&
        gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-8 col-md-12">
              <h3>
                <i className="fas fa-cube" /> {service.name}
              </h3>
              <h4>{settings.description}</h4>

              <div className="row">
                <div className="col-lg-6 col-md-12">
                  {settingInfoKeys.map((key, index) => {

                    let value = settings[key],
                        output = "";

                    if (typeof settings[key] === "object")
                      value = JSON.stringify(value);

                    if(value.length > 0) {
                      output = (
                        <div key={index} className="row serviceInfo">
                          <h4>{value}</h4>
                          <h5>{key}</h5>
                        </div>
                      );
                    }

                    return output;
                  })}

                  {repository &&
                  repository.downloadableFiles &&
                  repository.downloadableFiles.includes("corresp.txt") ? (
                    <div className="row serviceCorresp">
                      <h4>
                        <a
                          href={repository.path + "corresp.txt"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          class names <i className="fas fa-chevron-right" />
                        </a>
                      </h4>
                      <h5>corresp.txt</h5>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-lg-6 col-md-12">
                  { statsDisplay }
                </div>
              </div>
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
}));
export default MainView;
