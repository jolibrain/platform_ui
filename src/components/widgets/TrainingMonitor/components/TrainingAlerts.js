import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class TrainingAlerts extends React.Component {
  render() {
    let trainingAlert = null;

    const { service } = this.props;

    if (service.isRequesting) {
      trainingAlert = (
        <div className="loading alert alert-primary" role="alert">
          <i className="fas fa-spinner fa-spin" />&nbsp; Loading information...
        </div>
      );
    }

    return trainingAlert;
  }
}

TrainingAlerts.propTypes = {
  service: PropTypes.object.isRequired
};
