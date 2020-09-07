import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import PredictCard from "./Cards/Predict";
import TrainingCard from "./Cards/Training";
import ModelRepositoryCard from "./Cards/ModelRepository";
import DatasetCard from "./Cards/Dataset";

@inject("configStore")
@withRouter
@observer
class ServiceCardList extends React.Component {
  cardArray(services) {
    const { filterServiceName } = this.props;

    return services
      .filter(r => {
        return filterServiceName ? r.name.includes(filterServiceName) : true;
      })
      .map((service, index) => {
        let card = null;
        if (service.isRepository) {
          card = (
            <ModelRepositoryCard
              key={index}
              service={service}
              handleCompareStateChange={this.props.handleCompareStateChange}
            />
          );
        } else if (service.isDataset) {
          card = <DatasetCard key={index} dataset={service} />;
        } else if (service.settings && service.settings.training) {
          card = <TrainingCard key={index} service={service} />;
        } else {
          card = <PredictCard key={index} service={service} />;
        }
        return card;
      });
  }

  render() {
    const { services } = this.props;

    if (
      !services ||
      this.props.configStore.isComponentBlacklisted("ServiceCardList")
    )
      return null;

    return (
      <div className="serviceCardList row">{this.cardArray(services)}</div>
    );
  }
}

ServiceCardList.propTypes = {
  services: PropTypes.array.isRequired,
  filterServiceName: PropTypes.string,
  handleCompareStateChange: PropTypes.func
};
export default ServiceCardList;
