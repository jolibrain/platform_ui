import Header from "./Header";
import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import fontawesome from "@fortawesome/fontawesome";

import faPlusCircle from "@fortawesome/fontawesome-free-solid/faPlusCircle";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import faCube from "@fortawesome/fontawesome-free-solid/faCube";
import faTachometer from "@fortawesome/fontawesome-free-solid/faTachometerAlt";
import faSpinner from "@fortawesome/fontawesome-free-solid/faSpinner";

import Home from "./Home";
import Service from "./Service";
import ServiceNew from "./ServiceNew";

fontawesome.library.add(
  faPlusCircle,
  faAngleDown,
  faAngleRight,
  faCube,
  faTachometer,
  faSpinner
);

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
      this.props.gpuStore.setup(config);
      this.props.deepdetectStore.setup(config);
      this.props.imaginateStore.setup(config);
      this.props.modelRepositoriesStore.setup(config);
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
      // <Route path="/login" component={Login} />
      // <Route path="/register" component={Register} />
      // <Route path="/editor/:slug?" component={Editor} />
      // <Route path="/article/:id" component={Article} />
      // <PrivateRoute path="/settings" component={Settings} />
      // <Route path="/@:username" component={Profile} />
      // <Route path="/@:username/favorites" component={Profile} />
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
    return <Header />;
  }
}
