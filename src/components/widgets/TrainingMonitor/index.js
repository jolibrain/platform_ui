import React from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";

import TrainingAlerts from "./components/TrainingAlerts";
import GeneralInfo from "./components/GeneralInfo";
import PerClassArray from "./components/PerClassArray";

@inject("configStore")
@observer
export default class TrainingMonitor extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("TrainingMonitor"))
      return null;

    return (
      <div className="trainingmonitor">
        <GeneralInfo {...this.props} />
        <PerClassArray {...this.props} />
        <TrainingAlerts {...this.props} />
      </div>
    );
  }
}

TrainingMonitor.propTypes = {
  mltype: PropTypes.string.isRequired,
  measure: PropTypes.object.isRequired,
  measureHist: PropTypes.object.isRequired,
  isRequesting: PropTypes.bool
};
