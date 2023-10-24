import React from "react";
import { hot } from "react-hot-loader";

import { Switch, Route, withRouter } from "react-router-dom";
import { observer } from "mobx-react";

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
import stores from "../stores/rootStore";

const App = withRouter(observer(class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoIntervalId: null,
      trainingIntervalId: null,
      gpuInfoIntervalId: null
    };
  }

  async componentDidMount() {

    const { configPath } = this.props;

    const {
      configStore,
      gpuStore,
      deepdetectStore,
      imaginateStore,
      authTokenStore,
      modelRepositoriesStore,
      dataRepositoriesStore,
      videoExplorerStore,
      buildInfoStore
    } = stores;

    await configStore.loadConfig(configPath)

    if (configStore.layout === "minimal") {

      const serviceSettings = imaginateStore.settings.services[0];

      imaginateStore.service = new deepdetectService({
        serviceSettings: serviceSettings,
        serverName: deepdetectStore.server.name,
        serverSettings: deepdetectStore.server.settings
      });

    } else {

      deepdetectStore.setup(configStore);
      deepdetectStore.loadServices(true);
      deepdetectStore.refreshTrainInfo();

      if (configStore.gpuInfo) {
        gpuStore.setup(configStore);
        gpuStore.loadGpuInfo();
      }

      imaginateStore.setup(configStore);
      authTokenStore.setup();

      if (configStore.modelRepositories) {
        modelRepositoriesStore.setup(configStore);
      }

      if (configStore.dataRepositories) {
        dataRepositoriesStore.setup(configStore);
      }

      if (configStore.videoExplorer) {
        videoExplorerStore.setup(configStore);
      }

      buildInfoStore.loadBuildInfo();
    }
  }

  render() {
    const { configStore, deepdetectStore } = stores;

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
}));

App.defaultProps = {
  configPath: "/config.json"
}

export default hot(module)(App);
