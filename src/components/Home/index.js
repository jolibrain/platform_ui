import React from 'react';
import { Timeline } from 'react-twitter-widgets'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ServiceList from '../widgets/ServiceList';
import GpuInfo from '../widgets/GpuInfo';

export default class Home extends React.Component {

  render() {
    return (
      <div className="container home">
        <div className="row">

          <div className="col-md-4">
            <h5><FontAwesomeIcon icon="cube"/> Predict</h5>
            <ServiceList />
          </div>

          <div className="col-md-4">
            <GpuInfo />
          </div>

          <div className="col-md-4">
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
          </div>

        </div>

    </div>
    );
  }
}
