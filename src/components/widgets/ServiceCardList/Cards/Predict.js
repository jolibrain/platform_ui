/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import stores from "../../../../stores/rootStore";

const PredictCard = withRouter(observer(class PredictCard extends React.Component {
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
    const { service } = this.props;

    if (!service) return null;

    const serviceUrl = `/predict/${service.serverName}/${service.name}`;

    return (
      <div className="col-lg-4 col-md-12 my-2">
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
            <div className="card-subtitle text-muted row">
              <div className="col-6">
                <i className="fas fa-server" /> {service.serverName}
              </div>
              <div className="col-6">
                <i className="far fa-hdd" /> GPU: {service.gpuid}
              </div>
            </div>
          </div>
          <div className="card-footer text-right">
            {service.serverSettings.isWritable ? (
              <a
                onClick={this.openDeleteServiceModal}
                className="btn btn-outline-danger mr-1"
              >
                <i className="fas fa-trash" /> Delete
              </a>
            ) : (
              ""
            )}
            <Link to={serviceUrl} className="btn btn-primary">
              Predict <i className="fas fa-chevron-right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}));
export default PredictCard;
