import React from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";

import GeneralInfo from "./components/GeneralInfo";
import PerClassArray from "./components/PerClassArray";

@inject("configStore")
@observer
export default class TrainingMonitor extends React.Component {
  render() {
    const { service } = this.props;

    if (
      !service ||
      this.props.configStore.isComponentBlacklisted("TrainingMonitor")
    )
      return null;

    return (
      <div className="trainingmonitor">
        <GeneralInfo {...this.props} />
        <PerClassArray {...this.props} />
      </div>
    );
  }
}

TrainingMonitor.propTypes = {
  service: PropTypes.object.isRequired,
  handleOverMeasure: PropTypes.func,
  hoveredMeasure: PropTypes.number
};
