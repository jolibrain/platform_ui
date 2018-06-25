import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();
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

  render() {
    const { homeComponent } = this.props.configStore;
    const ddStore = this.props.deepdetectStore;

    // list currently running services in the same array
    let currentServices = [].concat.apply(
      [],
      ddStore.servers.map(server => server.services)
    );

    return (
      <div>
        <h2>Current Predict Service</h2>
        {ddStore.servers.map((server, serverIndex) => {
          return server.services.map((service, serviceIndex) => {
            return (
              <div className="card" style="width: 18rem;">
                <div className="card-body">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text">{service.settings.description}</p>
                  <a href="#" className="btn btn-primary">
                    Predict
                  </a>
                  <a href="#" className="btn btn-warning">
                    Delete
                  </a>
                </div>
              </div>
            );
          });
        })}
      </div>
    );
  }
}
