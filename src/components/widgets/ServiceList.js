import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@inject('deepdetectStore')
@observer
export default class ServiceList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.setServiceIndex = this.setServiceIndex.bind(this);
    this.timer();
  }

  componentDidMount() {
    const refreshRate = this.props.deepdetectStore.settings.infoRefreshRate;
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    this.props.deepdetectStore.loadServices()
  }

  setServiceIndex(index) {
    this.props.deepdetectStore.setCurrentServiceIndex(index);
  }

  render() {

    const ddstore = this.props.deepdetectStore;
    const { services, currentServiceIndex } = ddstore;

    if (services.length === 0)
      return null;

    return (
      <div className="block">

        <div className="context-header">
          <div className="sidebar-context-title">Services</div>
        </div>

        <div className="list-group">
        {
          services.map( (service, index) => {
            return (
              <span className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${ currentServiceIndex === index ? 'active' : ''}`} key={`service-${index}`} onClick={this.setServiceIndex.bind(this, index)}>
              { service.name }
              </span>
            );
          })
        }
        </div>

      </div>
    );
  }

}
