import LeftPanel from './LeftPanel';
import MainView from './MainView';
import React from 'react';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar home-component">

        <LeftPanel />
        <MainView />

    </div>
    );
  }
}
