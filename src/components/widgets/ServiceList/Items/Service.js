import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

const ServiceItem = withRouter(observer(class ServiceItem extends React.Component {
  render() {
    const { service, match } = this.props;

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
          to={`/${service.isTraining ? "training" : "predict"}/${
            service.serverName
          }/${service.name}`}
          title={service.name}
        >
          <span className="nav-item-name">
            {service.isTraining ? (
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
}));
export default ServiceItem;
