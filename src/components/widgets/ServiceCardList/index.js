import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import PredictCard from "./Cards/Predict.js";
import TrainingCard from "./Cards/Training.js";

@inject("deepdetectStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceCardList extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceCardList"))
      return null;

    let { services } = this.props.deepdetectStore;

    if (this.props.onlyPredict) {
      services = services.filter(s => !s.settings.training);
    } else if (this.props.onlyTraining) {
      services = services.filter(s => s.settings.training);
    }

    return (
      <div className="serviceCardList card-columns">
        {services.map((service, index) => {
          return service.settings.training ? (
            <TrainingCard key={index} service={service} />
          ) : (
            <PredictCard key={index} service={service} />
          );
        })}
      </div>
    );
  }
}

ServiceCardList.propTypes = {
  onlyPredict: PropTypes.bool,
  onlyTraining: PropTypes.bool
};
