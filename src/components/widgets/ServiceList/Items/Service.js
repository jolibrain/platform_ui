import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class ServiceItem extends React.Component {
  render() {
    const { service, match } = this.props;

    if (match && match.path) {
      const predictPatt = /^\/predict/g;
      const trainingPatt = /^\/training/g;

      // hide predict services in training section
      if (trainingPatt.test(match.path) && !service.settings.training) {
        return null;
      }

      // hide training services in predict section
      if (predictPatt.test(match.path) && service.settings.training) {
        return null;
      }
    }

    const selectedService =
      match &&
      match.params &&
      match.params.serviceName &&
      match.params.serviceName === service.name &&
      match.params.serverName &&
      match.params.serverName === service.serverName;

    return (
      <li className={selectedService ? "selected" : ""}>
        <Link
          id={`serviceList-${service.name}`}
          to={`/${service.settings.training ? "training" : "predict"}/${
            service.serverName
          }/${service.name}`}
        >
          <span className="nav-item-name">
            {service.settings.training ? (
              <i className="fas fa-braille" />
            ) : (
              <i className="fas fa-cube" />
            )}
            &nbsp;{decodeURIComponent(service.name)}
          </span>
        </Link>
      </li>
    );
  }
}
