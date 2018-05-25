import React from 'react';
import { Link, withRouter } from 'react-router-dom'

import RightPanel from './RightPanel';
import Imaginate from '../widgets/Imaginate';

@withRouter
export default class MainView extends React.Component {

  render() {

    const serviceName = this.props.match.params.serviceName;

    // TODO: Add delete service
    //          <li className="nav-item">
    //            <Link to={`/predict/${serviceName}/delete`} className="btn btn-outline-danger">Delete Service</Link>
    //          </li>

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className='breadcrumbs'>
            <Link to='/'>DeepDetect</Link> >&nbsp;
            <Link to='/predict'>Predict</Link> >&nbsp;
            <Link to={`/predict/${serviceName}`}>{serviceName}</Link>
          </div>
          <nav className="navbar navbar-expand-lg">
            <ul className="nav navbar-nav ml-auto" style={{flexDirection: 'row'}}>
              <li className="nav-item">
                <Link to='/predict/new' className="btn btn-outline-primary">New Service</Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <Imaginate />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
};
