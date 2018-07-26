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
@inject("commonStore")
@inject("gpuStore")
@inject("deepdetectStore")
@inject("imaginateStore")
@inject("modelRepositoriesStore")
@inject("dataRepositoriesStore")
@inject("modalStore")
@withRouter
@observer
export default class App extends React.Component {
  componentWillMount() {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded();
    }
    this.props.configStore.loadConfig(config => {
      if (config.gpuInfo) {
        this.props.gpuStore.setup(config);
      }

      this.props.deepdetectStore.setup(config);
      this.props.imaginateStore.setup(config);
      this.props.modalStore.setup(config);

      if (config.modelRepositories) {
        this.props.modelRepositoriesStore.setup(config);
      }

      if (config.dataRepositories) {
        this.props.dataRepositoriesStore.setup(config);
      }
    });
  }

  componentDidMount() {
    if (this.props.commonStore.token) {
      this.props.userStore
        .pullUser()
        .finally(() => this.props.commonStore.setAppLoaded());
    }
  }

  render() {
    if (
      this.props.commonStore.appLoaded &&
      this.props.configStore.configLoaded &&
      this.props.modelRepositoriesStore.isReady &&
      this.props.deepdetectStore.isReady
    ) {
      return (
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/user/:username" component={Home} />

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
