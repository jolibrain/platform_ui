import React from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

@inject("deepdetectStore")
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
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    this.props.deepdetectStore.loadServices(this.props.status);
  }

  setServiceIndex(index) {
    this.props.deepdetectStore.setCurrentServiceIndex(index);
  }

  render() {
    const ddstore = this.props.deepdetectStore;
    const { servers, currentServerIndex } = ddstore;

    const services = [].concat.apply(
      [],
      servers.map((server, serverIndex) => {
        return server.services.map((service, serviceIndex) => {
          return {
            serverName: server.name,
            serviceName: service.name,
            isActive:
              currentServerIndex === serverIndex &&
              server.currentServiceIndex === serviceIndex
          };
        });
      })
    );

    if (services.length === 0)
      return (
        <ul className="serviceList sidebar-top-level-items">
          <li />
        </ul>
      );

    return (
      <ul className="serviceList sidebar-top-level-items">
        {services.map((service, index) => {
          return (
            <li
              key={`service-item-${index}`}
              className={service.isActive ? "active" : ""}
            >
              <Link
                key={`service-link-${index}`}
                to={`/predict/${service.serverName}/${service.serviceName}`}
              >
                <span className="nav-item-name">
                  {service.serviceName}
                  <span class="badge badge-secondary">
                    {service.serverName}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}
