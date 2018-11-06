import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import Home from "./Home";
import Header from "./Header";

import PredictHome from "./Predict/Home";
import PredictNew from "./Predict/New";
import PredictShow from "./Predict/Show";

import TrainingHome from "./Training/Home";
import TrainingShow from "./Training/Show";
import TrainingArchive from "./Training/Archive";

import GenericNotFound from "./GenericNotFound";

import Imaginate from "./widgets/Imaginate";
import deepdetectService from "../stores/deepdetect/service";

@inject("configStore")
@inject("buildInfoStore")
@inject("gpuStore")
@inject("deepdetectStore")
@inject("imaginateStore")
@inject("modelRepositoriesStore")
@inject("dataRepositoriesStore")
@inject("modalStore")
@inject("authTokenStore")
@withRouter
@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoIntervalId: null,
      trainingIntervalId: null,
      gpuInfoIntervalId: null
    };

    this.setupTimers = this.setupTimers.bind(this);
  }

  setupTimers() {
    const { deepdetectStore, configStore } = this.props;

    if (deepdetectStore.settings && configStore.gpuInfo) {
      const { info, training } = deepdetectStore.settings.refreshRate;
      const gpuInfo = configStore.gpuInfo.refreshRate;

      this.setState({
        infoIntervalId: setInterval(this.infoTimer.bind(this), info),
        trainingIntervalId: setInterval(
          this.trainingTimer.bind(this),
          training
        ),
        gpuInfoIntervalId: setInterval(this.gpuInfoTimer.bind(this), gpuInfo)
      });

      this.infoTimer();
      this.trainingTimer();
      this.gpuInfoTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.infoIntervalId);
    clearInterval(this.state.trainingIntervalId);
    clearInterval(this.state.gpuInfoIntervalId);
  }

  componentWillReceiveProps(nextProps) {
    // timer has to be called in order to refresh Training Show component
    // fix issue #157 - https://gitlab.com/jolibrain/core-ui/issues/157
    this.trainingTimer();
  }

  infoTimer() {
    this.props.deepdetectStore.loadServices(true);
  }

  trainingTimer() {
    this.props.deepdetectStore.refreshTrainInfo();
  }

  gpuInfoTimer() {
    this.props.gpuStore.loadGpuInfo();
  }

  componentWillMount() {
    const {
      configStore,
      gpuStore,
      buildInfoStore,
      deepdetectStore,
      imaginateStore,
      authTokenStore,
      modelRepositoriesStore,
      dataRepositoriesStore
    } = this.props;

    configStore.loadConfig(config => {
      if (config.gpuInfo) {
        gpuStore.setup(config);
      }

      buildInfoStore.loadBuildInfo();

      deepdetectStore.setup(config);
      imaginateStore.setup(config);
      authTokenStore.setup();

      if (config.modelRepositories) {
        modelRepositoriesStore.setup(config);
      }

      if (config.dataRepositories) {
        dataRepositoriesStore.setup(config);
      }

      if (config.layout === "minimal") {
        const serviceSettings = imaginateStore.settings.services[0];
        imaginateStore.service = new deepdetectService({
          serviceSettings: serviceSettings,
          serverName: deepdetectStore.server.name,
          serverSettings: deepdetectStore.server.settings
        });
      }

      this.setupTimers();
    });
  }

  render() {
    const { configStore, deepdetectStore } = this.props;

    if (!configStore.isReady || !deepdetectStore.isReady) return null;

    // Minimal Layout
    if (configStore.layout === "minimal") {
      return (
        <div>
          <Route exact path="/" component={Imaginate} />
        </div>
      );

      // Full Layout
    } else {
      return (
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />

            <Route exact path="/predict" component={PredictHome} />
            <Route exact path="/predict/new" component={PredictNew} />
            <Route
              exact
              path="/predict/:serverName/:serviceName"
              component={PredictShow}
            />

            <Route exact path="/training" component={TrainingHome} />
            <Route exact path="/trainingArchive" component={TrainingHome} />
            <Route
              exact
              path="/training/:serverName/:serviceName"
              component={TrainingShow}
            />
            <Route
              exact
              path="/trainingArchive/:modelPath*"
              component={TrainingArchive}
            />

            <Route exact path="/404" component={GenericNotFound} />
          </Switch>
        </div>
      );
    }
  }
}
