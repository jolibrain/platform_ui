import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class PredictCard extends React.Component {
  render() {
    const { service } = this.props;

    if (!service) return null;

    const serviceUrl = `/predict/${service.serverName}/${service.name}`;

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{service.name}</h5>
          <p className="card-text">{service.settings.description}</p>
          <Link to={serviceUrl} className="btn btn-outline-primary">
            Predict
          </Link>
        </div>
      </div>
    );
  }
}

PredictCard.propTypes = {
  service: PropTypes.object.isRequired
};
