import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Card from "./components/Card";
import ListItem from "./components/ListItem";

import SkeletonCard from "./skeletons/Card";

@inject("configStore")
@inject("modelRepositoriesStore")
@withRouter
@observer
class PredictServiceList extends React.Component {

  renderSkeletonCards() {
    return (
      <div id="predictServiceList-cards" className="serviceQuickCreate row">
        { [...Array(3)].map(() => <SkeletonCard />) }
      </div>
    );
  }

  renderCards() {
    const { services, modelRepositoriesStore } = this.props;
    return modelRepositoriesStore.isRefreshing &&
      services.length === 0 ?
      this.renderSkeletonCards()
      :
      (
        <div id="predictServiceList-cards" className="serviceQuickCreate row">
          {services.map((service, index) => {
            return (
              <Card
                key={`${index}-${service.name}`}
                repository={service}
                {...this.props}
              />
            );
          })}
        </div>
      );
  }

  renderList() {
    const { services } = this.props;
    return (
      <div
        id="predictServiceList-list"
        className="serviceQuickCreate container-fluid"
      >
        {services.map((service, index) => {
          return (
            <ListItem
              key={`${index}-${service.name}`}
              repository={service}
              {...this.props}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { layout } = this.props;

    if (this.props.configStore.isComponentBlacklisted("PredictServiceList"))
      return null;

    let content = null;

    switch (layout) {
      case "list":
        content = this.renderList();
        break;
      case "cards":
      default:
        content = this.renderCards();
        break;
    }

    return content;
  }
}

PredictServiceList.propTypes = {
  services: PropTypes.array.isRequired,
  layout: PropTypes.string
};
export default PredictServiceList;
