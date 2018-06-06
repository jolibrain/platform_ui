import Header from "./Header";
import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import Home from "./Home";
import Service from "./Service";
import ServiceNew from "./ServiceNew";

import Imaginate from "./widgets/Imaginate";

@inject("configStore")
@inject("commonStore")
@inject("gpuStore")
@inject("deepdetectStore")
@inject("imaginateStore")
@inject("modelRepositoriesStore")
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

      if (config.modelRepositories) {
        this.props.modelRepositoriesStore.setup(config);
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
      this.props.deepdetectStore.servicesLoaded
    ) {
      // Minimal Layout
      if (
        this.props.deepdetectStore.settings.services.defaultService &&
        this.props.deepdetectStore.settings.services.defaultService.length > 0
      ) {
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
              <Route path="/predict/new" component={ServiceNew} />
              <Route path="/predict/:serviceName" component={Service} />
              <Route path="/predict" component={Service} />
            </Switch>
          </div>
        );
      }
    }
    return <Header />;
  }
}
