import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
export default class GpuInfo extends React.Component {

  render() {
    return (
      <div className="block">
        <div className="context-header">
          <div className="sidebar-context-title">Infra</div>
        </div>

        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">GPU 1</div>
        </div>

        <div className="progress">
          <div className="progress-bar bg-warning" role="progressbar" style={{width: '75%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">GPU 2</div>
        </div>
      </div>
    );
  }

}
