import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { inject } from "mobx-react";

@inject("configStore")
export default class Breadcrumb extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("Breadcrumb"))
      return null;

    const { service, isTraining } = this.props;

    if (!service) return null;

    const root = isTraining
      ? {
          path: "/training",
          label: "Training"
        }
      : {
          path: "/predict",
          label: "Predict"
        };

    const serviceJsonUrl = service.urlGetService;
    const trainingJsonUrl = service.urlTraining;

    return (
      <div className="breadcrumbs clearfix">
        <Link to="/">DeepDetect</Link> >&nbsp;
        <Link to={root.path}>{root.label}</Link> >&nbsp;
        {service.serverName ? (
          <span>
            <i class="fas fa-server" /> <b>{service.serverName}</b> >&nbsp;
          </span>
        ) : (
          ""
        )}
        {service.gpuid ? (
          <span>
            <i class="fas fa-hdd" /> <b>{service.gpuid}</b> >&nbsp;
          </span>
        ) : (
          ""
        )}
        <Link to={`${root.path}/${service.serverName}/${service.name}`}>
          {service.name}
        </Link>
        <a
          href={serviceJsonUrl}
          className="badge badge-secondary"
          target="_blank"
          rel="noreferrer noopener"
        >
          Service JSON
        </a>
        {trainingJsonUrl ? (
          <a
            href={trainingJsonUrl}
            className="badge badge-secondary"
            target="_blank"
            rel="noreferrer noopener"
          >
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
  service: PropTypes.object.isRequired,
  isTraining: PropTypes.bool
};
