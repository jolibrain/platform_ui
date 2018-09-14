import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class ServiceItem extends React.Component {
  render() {
    const { service } = this.props;

    return (
      <li>
        <Link
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
            &nbsp;{service.name}
          </span>
        </Link>
      </li>
    );
  }
}
