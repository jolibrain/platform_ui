import Header from './Header';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Home from './Home';

@inject('commonStore')
@withRouter
@observer
export default class App extends React.Component {

  componentWillMount() {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded();
    }
  }

  componentDidMount() {
    if (this.props.commonStore.token) {
      this.props.userStore.pullUser()
        .finally(() => this.props.commonStore.setAppLoaded());
    }
  }

  render() {
    if (this.props.commonStore.appLoaded) {
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
            <Route path="/" component={Home} />
          </Switch>
        </div>
      );
    }
    return (
      <Header />
    );
  }
}
