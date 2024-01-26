/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import stores from "../../../stores/rootStore";

const Breadcrumb = observer(class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteServiceModal = this.openDeleteServiceModal.bind(this);
  }

  openDeleteServiceModal() {
    const { modalStore } = stores;
    modalStore.setVisible("deleteService", true, {
      service: this.props.service
    });
  }

  render() {
    const { configStore } = stores;
    if (configStore.isComponentBlacklisted("Breadcrumb"))
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
          className="badge text-bg-secondary"
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fas fa-chevron-circle-right" />
          &nbsp; Service JSON
        </a>
        {trainingJsonUrl ? (
          <a
            href={trainingJsonUrl}
            className="badge text-bg-secondary"
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
            className="badge text-bg-secondary delete-service"
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
});
export default Breadcrumb;
