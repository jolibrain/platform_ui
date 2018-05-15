import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'
import { parse as qsParse } from 'query-string';

@inject('commonStore', 'servicesStore')
@withRouter
@observer
export default class Services extends React.Component {

  componentDidMount() {
    this.props.servicesStore.loadServices();
  }

  render() {

    const services = this.props.servicesStore.getServices();

    return (
      <div className="col-md-6">
        <h2>Service List</h2>
        <ul>
        {
          services.map(service => {
            return (
              <li>{service.name}</li>
            );
          })
        }
      </ul>
  </div>
    );
  }
};
