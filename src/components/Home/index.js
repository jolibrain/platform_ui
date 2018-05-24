import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import ServiceList from '../widgets/ServiceList';
import GpuInfo from '../widgets/GpuInfo';

@inject('commonStore')
@withRouter
@observer
export default class Home extends React.Component {

  render() {
    return (
      <div className="container home">
        <div className="row">

          <div className="col-md-4">
            <h5>Predict</h5>
            <ServiceList />
          </div>

          <div className="col-md-4">
            <GpuInfo />
          </div>

          <div className="col-md-4">
          </div>

        </div>

    </div>
    );
  }
}
