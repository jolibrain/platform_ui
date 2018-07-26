import React from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";

@inject("deepdetectStore")
@observer
export default class TrainingAlerts extends React.Component {
  render() {
    let trainingAlert = null;

    if (this.props.isRequesting) {
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
  isRequesting: PropTypes.bool
};
