import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class TrainingCard extends React.Component {
  render() {
    const { server, service } = this.props;

    if (!server || !service) return null;

    const serviceUrl = `/training/${server.name}/${service.name}`;

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{service.name}</h5>
          <p className="card-text">{service.settings.description}</p>
          <Link to={serviceUrl} className="btn btn-outline-primary">
            Monitor
          </Link>
        </div>
      </div>
    );
  }
}
