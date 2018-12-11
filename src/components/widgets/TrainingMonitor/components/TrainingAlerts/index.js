import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class TrainingAlerts extends React.Component {
  render() {
    const { service } = this.props;

    let spinner = null;
    if (service.isRequesting) {
      spinner = (
        <span className="badge">
          <i className="fas fa-spinner fa-spin" />
        </span>
      );
    }

    return (
      <div className="row">
        <div className="col-6">
          <h3>{service.name}</h3>
        </div>
        <div className="col-6 text-right">{spinner}</div>
      </div>
    );
  }
}

TrainingAlerts.propTypes = {
  service: PropTypes.object.isRequired
};
