import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import PredictCard from "./Predict";
import TrainingCard from "./Training";
import ModelRepositoryCard from "./ModelRepository";
import DatasetCard from "./Dataset";

@withRouter
@observer
class Cards extends React.Component {

    render() {

        const {
            services,
            handleCompareStateChange
        } = this.props;

        return services
            .map((service, index) => {
                let card = null;
                if (service.isRepository) {
                    card = (
                        <ModelRepositoryCard
                          key={index}
                          service={service}
                          handleCompareStateChange={handleCompareStateChange}
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

}

Cards.propTypes = {
  services: PropTypes.array.isRequired,
  handleCompareStateChange: PropTypes.func,
};
export default Cards;
