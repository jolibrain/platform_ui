import React from 'react';
import { Timeline } from 'react-twitter-widgets';

import RightPanel from './RightPanel';

export default class MainView extends React.Component {

  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">

            <Timeline
              dataSource={{
                sourceType: 'profile',
                screenName: 'jolibrain'
              }}
              options={{
                username: 'Jolibrain',
                height: '600'
              }}
            />

            <RightPanel />

          </div>
        </div>
      </div>
    );
  }
};
