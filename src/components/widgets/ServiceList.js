import React from 'react';
import { inject, observer } from 'mobx-react';
import Modal from 'react-bootstrap4-modal';

@inject('commonStore')
@inject('deepdetectStore')
@inject('modalStore')
@observer
export default class ServiceList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.setServiceIndex = this.setServiceIndex.bind(this);
    this.openServiceNewModal = this.openServiceNewModal.bind(this);
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

  openServiceNewModal() {
    this.props.modalStore.setVisible('serviceNew');
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
          <button className='btn btn-primary btn-sm' onClick={this.openServiceNewModal}>New Service</button>
        </div>

        <div className="list-group">
        {
          services.map( (service, index) => {
            return (
              <button className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${ currentServiceIndex === index ? 'active' : ''}`} key={`service-${index}`} onClick={this.setServiceIndex.bind(this, index)}>
              { service.name }
              </button>
            );
          })
        }
        </div>
      </div>
    );
  }

}
