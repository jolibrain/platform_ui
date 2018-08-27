import Header from "./Header";
import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import Home from "./Home";

import PredictHome from "./Predict/Home";
import PredictNew from "./Predict/New";
import PredictShow from "./Predict/Show";

import TrainingHome from "./Training/Home";
import TrainingShow from "./Training/Show";
import TrainingArchive from "./Training/Archive";

import GenericNotFound from "./GenericNotFound";

// TODO: restore light config
// import Imaginate from "./widgets/Imaginate";

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
    const { info, training } = this.props.deepdetectStore.settings.refreshRate;
    const gpuInfo = this.props.configStore.gpuInfo.refreshRate;

    this.setState({
      infoIntervalId: setInterval(this.infoTimer.bind(this), info),
      trainingIntervalId: setInterval(this.trainingTimer.bind(this), training),
      gpuInfoIntervalId: setInterval(this.gpuInfoTimer.bind(this), gpuInfo)
    });

    this.infoTimer();
    this.trainingTimer();
    this.gpuInfoTimer();
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
    this.props.configStore.loadConfig(config => {
      if (config.gpuInfo) {
        this.props.gpuStore.setup(config);
      }

      this.props.buildInfoStore.loadBuildInfo();

      this.props.deepdetectStore.setup(config);
      this.props.imaginateStore.setup(config);
      this.props.modalStore.setup(config);
      this.props.authTokenStore.setup();

      if (config.modelRepositories) {
        this.props.modelRepositoriesStore.setup(config);
      }

      if (config.dataRepositories) {
        this.props.dataRepositoriesStore.setup(config);
      }

      this.setupTimers();
    });
  }

  render() {
    if (
      this.props.configStore.isReady &&
      this.props.modelRepositoriesStore.isReady &&
      this.props.deepdetectStore.isReady
    ) {
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
            <Route
              exact
              path="/training/:serverName/:serviceName"
              component={TrainingShow}
            />
            <Route
              exact
              path="/trainingArchive/:modelName"
              component={TrainingArchive}
            />

            <Route exact path="/404" component={GenericNotFound} />
          </Switch>
        </div>
      );

      //
      // TODO : restore minimal layout, not working since multiserver
      //
      // Minimal Layout
      // if (
      //   this.props.deepdetectStore.settings.services.defaultService &&
      //   this.props.deepdetectStore.settings.services.defaultService.length > 0
      // ) {
      //   return (
      //     <div>
      //       <Route exact path="/" component={Imaginate} />
      //     </div>
      //   );

      //   // Full Layout
      // } else {
      // }
      //
    }
    return <Header />;
  }
}
