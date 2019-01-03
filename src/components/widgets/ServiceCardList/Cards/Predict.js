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
      <div className="col-md-4 col-sm-12 my-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <span className="title">
                <i className="fas fa-cube" /> {service.name}
              </span>
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {service.settings.description}
            </h6>
          </div>
          <div className="card-footer text-center">
            <Link to={serviceUrl}>
              Predict <i className="fas fa-chevron-right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

PredictCard.propTypes = {
  service: PropTypes.object.isRequired
};
