import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

//import PredictContent from "./Content/Predict";
//import TrainingContent from "./Content/Training";
import ModelRepositoryContent from "./Content/ModelRepository";

@inject("configStore")
@withRouter
@observer
export default class ServiceContentList extends React.Component {
  contentArray(services) {
    const { filterServiceName } = this.props;

    return services
      .filter(r => {
        return filterServiceName ? r.name.includes(filterServiceName) : true;
      })
      .map((service, index) => {
        let content = null;
        if (service.jsonMetrics || service.bestModel) {
          content = <ModelRepositoryContent key={index} service={service} />;
        } else if (service.settings && service.settings.training) {
          //content = <TrainingContent key={index} service={service} />;
        } else {
          //content = <PredictContent key={index} service={service} />;
        }
        return content;
      });
  }

  render() {
    const { services } = this.props;

    if (
      !services ||
      this.props.configStore.isComponentBlacklisted("ServiceContentList")
    )
      return null;

    return (
      <div className="serviceContentList container-fluid">
        {this.contentArray(services)}
      </div>
    );
  }
}

ServiceContentList.propTypes = {
  services: PropTypes.array.isRequired,
  filterServiceName: PropTypes.string
};
