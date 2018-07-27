import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import PredictCard from "./Cards/Predict";
import TrainingCard from "./Cards/Training";
import ModelRepositoryCard from "./Cards/ModelRepository";

@inject("configStore")
@withRouter
@observer
export default class ServiceCardList extends React.Component {
  render() {
    const { services } = this.props;

    if (
      !services ||
      this.props.configStore.isComponentBlacklisted("ServiceCardList")
    )
      return null;

    return (
      <div className="serviceCardList card-columns">
        {services.map((service, index) => {
          let card = null;
          if (service.jsonMetrics) {
            card = <ModelRepositoryCard key={index} service={service} />;
          } else if (service.settings.training) {
            card = <TrainingCard key={index} service={service} />;
          } else {
            card = <PredictCard key={index} service={service} />;
          }
          return card;
        })}
      </div>
    );
  }
}

ServiceCardList.propTypes = {
  services: PropTypes.array
};
