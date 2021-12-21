import React from "react";

import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import Home from "./Home";
import Loading from "./Loading";

import PredictHome from "./Predict/Home";
import PredictNew from "./Predict/New";
import PredictShow from "./Predict/Show";

import TrainingHome from "./Training/Home";
import TrainingShow from "./Training/Show";

import ChartShow from "./Chart/Show";

import ChainShow from "./Chain/Show";

import DatasetHome from "./Dataset/Home";

import VideoExplorerHome from "./VideoExplorer/Home";

import GenericNotFound from "./GenericNotFound";

import Imaginate from "./widgets/Imaginate";

import deepdetectService from "../stores/deepdetect/service";

@inject("configStore")
@inject("gpuStore")
@inject("deepdetectStore")
@inject("imaginateStore")
@inject("modelRepositoriesStore")
@inject("dataRepositoriesStore")
@inject("datasetStore")
@inject("videoExplorerStore")
@inject("modalStore")
@inject("authTokenStore")
@inject("buildInfoStore")
@withRouter
@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoIntervalId: null,
      trainingIntervalId: null,
      gpuInfoIntervalId: null
    };
  }

  componentDidMount() {
    const {
      configPath,
      configStore,
      gpuStore,
      deepdetectStore,
      imaginateStore,
      authTokenStore,
      modelRepositoriesStore,
      dataRepositoriesStore,
      videoExplorerStore,
      buildInfoStore,
      datasetStore,
    } = this.props;

    configStore.loadConfig(config => {
      if (config.layout === "minimal") {
        const serviceSettings = imaginateStore.settings.services[0];

        imaginateStore.service = new deepdetectService({
          serviceSettings: serviceSettings,
          serverName: deepdetectStore.server.name,
          serverSettings: deepdetectStore.server.settings
        });
      } else {
        deepdetectStore.setup(config);
        deepdetectStore.loadServices(true);
        deepdetectStore.refreshTrainInfo();

        if (config.gpuInfo) {
          gpuStore.setup(config);
          gpuStore.loadGpuInfo();
        }

        imaginateStore.setup(config);
        authTokenStore.setup();

        if (config.modelRepositories) {
          modelRepositoriesStore.setup(config);
        }

        if (config.dataRepositories) {
          dataRepositoriesStore.setup(config);
        }

        if (config.videoExplorer) {
          videoExplorerStore.setup(config);
        }

        datasetStore.setup(config);

        buildInfoStore.loadBuildInfo();
      }
    }, configPath);
  }

  render() {
    const { configStore, deepdetectStore } = this.props;

    if (!configStore.isReady) return null;

    let appComponent = <Loading />;

    if (deepdetectStore.isReady) {

      switch(configStore.layout) {
          case 'minimal':
            // Minimal Layout
            appComponent = (
              <div>
                <Route exact path="/" component={Imaginate} />
              </div>
            );
            break;
          case 'video-explorer':
            // video-explorer single component Layout
            appComponent = (
              <div>
                <Route exact path="/" component={VideoExplorerHome} />
              </div>
            );
            break;
          case 'full':
          default:
            appComponent = (
              <Switch>
                {/* Home */}
                <Route exact path="/" component={Home} />

                {/* Predict */}
                <Route exact path="/predict" component={PredictHome} />
                <Route exact path="/predict/new" component={PredictNew} />
                <Route
                  exact
                  path="/predict/:serverName/:serviceName*"
                  component={PredictShow}
                />

                {/* Training */}
                <Route exact path="/training" component={TrainingHome} />
                <Route exact path="/trainingArchive" component={TrainingHome} />
                <Route
                  exact
                  path="/training/:serverName/:serviceName*"
                  component={TrainingShow}
                />

                {/* Chart */}
                <Route
                  exact
                  path="/charts/:chartType/:chartParams*"
                  component={ChartShow}
                />

                {/* Chain */}
                <Route exact path="/chains/:chainName" component={ChainShow} />

                {/* Dataset */}
                <Route exact path="/datasets/" component={DatasetHome} />

                {/* VideoExplorer */}
                <Route exact path="/video-explorer/" component={VideoExplorerHome} />

                {/* 404 */}
                <Route exact path="/404" component={GenericNotFound} />
              </Switch>
            );
            break;
      }
    }

    return appComponent;
  }
}

App.defaultProps = {
  configPath: "/config.json"
}

export default App;
