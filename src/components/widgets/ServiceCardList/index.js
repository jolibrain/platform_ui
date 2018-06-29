import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class ServiceCardList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();

    this._mapServers = this._mapServers.bind(this);
    this._mapServices = this._mapServices.bind(this);
  }

  componentDidMount() {
    const refreshRate = this.props.deepdetectStore.settings.infoRefreshRate;
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    const status = true;
    this.props.deepdetectStore.loadServices(status);
  }

  _mapServers(server, serverIndex) {
    return server.services.map(
      this._mapServices.bind(this, server, serverIndex)
    );
  }

  _mapServices(server, serverIndex, service, serviceIndex) {
    if (
      (this.props.onlyPredict && service.settings.training) ||
      (this.props.onlyTraining && !service.settings.training)
    )
      return null;

    return (
      <div className="card" key={`${serverIndex}-${serviceIndex}`}>
        <div className="card-body">
          <h5 className="card-title">{service.name}</h5>
          <p className="card-text">{service.settings.description}</p>
          <Link
            to={`/predict/${server.name}/${service.name}`}
            className="btn btn-outline-primary"
          >
            {service.settings.training ? "Training" : "Predict"}
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const ddStore = this.props.deepdetectStore;

    return (
      <div className="serviceCardList card-columns">
        {ddStore.servers.map(this._mapServers)}
      </div>
    );
  }
}
