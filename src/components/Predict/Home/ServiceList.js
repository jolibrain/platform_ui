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
    const ddStore = this.props.deepdetectStore;

    return (
      <div className="serviceList">
        <h4>Current Predict Service</h4>
        {ddStore.servers.map((server, serverIndex) => {
          return server.services.map((service, serviceIndex) => {
            return (
              <div className="card w-25">
                <div className="card-body">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text">{service.settings.description}</p>
                  <Link
                    to={`/predict/${server.name}/${service.name}`}
                    className="btn btn-outline-primary"
                  >
                    Predict
                  </Link>
                </div>
              </div>
            );
          });
        })}
      </div>
    );
  }
}
