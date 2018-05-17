import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('commonStore')
@observer
export default class ServiceList extends React.Component {

  render() {
    return (
      <div className="block list-group">
        <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center active">
          Cras justo odio
          <span className="badge badge-light badge-pill">14</span>
        </Link>
        <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          Dapibus ac facilisis in
          <span className="badge badge-secondary badge-pill">1</span>
        </Link>
        <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          Morbi leo risus
          <span className="badge badge-primary badge-pill">12</span>
        </Link>
        <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          Porta ac consectetur ac
          <span className="badge badge-primary badge-pill">13</span>
        </Link>
      </div>
    );
  }

}
