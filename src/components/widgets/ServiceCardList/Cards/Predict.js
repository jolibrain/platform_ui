import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("modalStore")
@withRouter
@observer
export default class PredictCard extends React.Component {
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
          </div>
          <div className="card-footer text-right">
            <a
              onClick={this.openDeleteServiceModal}
              className="btn btn-outline-danger"
            >
              <i className="fas fa-trash" /> Delete
            </a>{" "}
            <Link to={serviceUrl} className="btn btn-primary">
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
