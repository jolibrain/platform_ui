/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { inject } from "mobx-react";

@inject("modalStore")
@inject("configStore")
class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteServiceModal = this.openDeleteServiceModal.bind(this);
  }

  openDeleteServiceModal() {
    const { modalStore } = this.props;
    modalStore.setVisible("deleteService", true, {
      service: this.props.service
    });
  }

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
            <i className="fas fa-server" /> <b>{service.serverName}</b> >&nbsp;
          </span>
        ) : (
          ""
        )}
        {service.gpuid !== "--" ? (
          <span>
            <i className="far fa-hdd" /> <b>{service.gpuid}</b> >&nbsp;
          </span>
        ) : (
          ""
        )}
        <Link to={`${root.path}/${service.serverName}/${service.name}`}>
          {decodeURIComponent(service.name)}
        </Link>
        <a
          href={serviceJsonUrl}
          className="badge badge-secondary"
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fas fa-chevron-circle-right" />
          &nbsp; Service JSON
        </a>
        {trainingJsonUrl ? (
          <a
            href={trainingJsonUrl}
            className="badge badge-secondary"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i className="fas fa-chevron-circle-right" />
            &nbsp; Training JSON
          </a>
        ) : (
          ""
        )}
        {service.serverSettings.isWritable ? (
          <a
            className="badge badge-secondary delete-service"
            onClick={this.openDeleteServiceModal}
          >
            <i className="far fa-trash-alt" />
            &nbsp; Delete Service
          </a>
        ) : (
          ""
        )}
        {service.isRequesting ? (
          <span className="badge badge-requesting">
            <i className="fas fa-spinner fa-spin" />
          </span>
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
export default Breadcrumb;
