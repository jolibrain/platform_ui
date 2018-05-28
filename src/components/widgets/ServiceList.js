import React from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

@inject("commonStore")
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
    this.props.deepdetectStore.loadServices();
  }

  setServiceIndex(index) {
    this.props.deepdetectStore.setCurrentServiceIndex(index);
  }

  render() {
    const ddstore = this.props.deepdetectStore;
    const { services, currentServiceIndex } = ddstore;

    if (services.length === 0) return null;

    return (
      <ul className="serviceList sidebar-top-level-items">
        {services.map((service, index) => {
          return (
            <li
              key={`service-${index}`}
              className={currentServiceIndex === index ? "active" : ""}
            >
              <Link key={`service-${index}`} to={`/predict/${service.name}`}>
                <span className="nav-item-name">{service.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}
