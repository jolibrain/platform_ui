import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class PredictCard extends React.Component {
  render() {
    const ddStore = this.props.deepdetectStore;
    const isActive =
      ddStore.currentServerIndex === serverIndex &&
      ddStore.server.currentServiceIndex === serviceIndex;

    return (
      <li className={isActive ? "active" : ""}>
        <Link
          to={`/${service.settings.training ? "training" : "predict"}/${
            server.name
          }/${service.name}`}
        >
          <span className="nav-item-name">
            {service.name}
            <span className="badge badge-secondary float-right">
              {server.name}
            </span>
          </span>
        </Link>
      </li>
    );
  }
}
