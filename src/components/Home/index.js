import LeftPanel from './LeftPanel';
import MainView from './MainView';
import Modals from './Modals';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('commonStore')
@withRouter
@observer
export default class Home extends React.Component {
  componentDidMount() {
    //this.props.commonStore.loadTags();
  }

  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar">

        <LeftPanel />
        <MainView />
        <Modals />

    </div>
    );
  }
}
