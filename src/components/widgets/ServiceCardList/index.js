import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import PredictCard from "./Cards/Predict";
import TrainingCard from "./Cards/Training";
import ModelRepositoryCard from "./Cards/ModelRepository";
import DatasetCard from "./Cards/Dataset";

import stores from "../../../stores/rootStore";

const ServiceCardList = withRouter(observer(class ServiceCardList extends React.Component {
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
        } else if (service.isTraining) {
          card = <TrainingCard key={index} service={service} />;
        } else {
          card = <PredictCard key={index} service={service} />;
        }
        return card;
      });
  }

  render() {
    const { configStore } = stores;
    const { services } = this.props;

    if (
      !services ||
      configStore.isComponentBlacklisted("ServiceCardList")
    )
      return null;

    return (
      <div className="serviceCardList row">{this.cardArray(services)}</div>
    );
  }
}));
export default ServiceCardList;
