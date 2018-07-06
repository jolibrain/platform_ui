import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

@withRouter
export default class Breadcrumb extends React.Component {
  render() {
    const { server, service, isTraining } = this.props;

    const root = isTraining
      ? {
          path: "/training",
          label: "Training"
        }
      : {
          path: "/predict",
          label: "Predict"
        };

    return (
      <div className="breadcrumbs clearfix">
        <Link to="/">DeepDetect</Link> >&nbsp;
        <Link to={root.path}>{root.label}</Link> >&nbsp;
        <Link to={`${root.path}/${server.name}`}>{server.name}</Link> >&nbsp;
        <Link to={`${root.path}/${server.name}/${service.name}`}>
          {service.name}
        </Link>
        <a href={service.urlGetService} className="badge badge-secondary">
          Service JSON
        </a>
        {isTraining ? (
          <a href={service.urlTraining} className="badge badge-secondary">
            Training JSON
          </a>
        ) : (
          ""
        )}
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  server: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  isTraining: PropTypes.bool
};
