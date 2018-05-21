import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('commonStore')
@inject('deepdetectStore')
@observer
export default class ServiceList extends React.Component {

  componentDidMount() {
    this.props.deepdetectStore.loadServices()
  }

  render() {

    const { ddStore } = this.props.deepdetectStore;

    if(!ddStore)
      return null;

    return (
      <div className="block list-group">
        {
          ddStore.services().map( (service, index) => {
            return (
              <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" key={`service-${index}`}>
              { service.name }
              </Link>
            );
          })
        }
      </div>
    );
  }

}
