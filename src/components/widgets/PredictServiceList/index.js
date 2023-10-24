import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Card from "./components/Card";
import ListItem from "./components/ListItem";

import SkeletonCard from "./skeletons/Card";

import stores from "../../../stores/rootStore";

const PredictServiceList = withRouter(observer(class PredictServiceList extends React.Component {

  renderSkeletonCards() {
    return (
      <div id="predictServiceList-cards" className="serviceQuickCreate row">
        { [...Array(3)].map((element, index) => <SkeletonCard key={`skeleton-${index}`}/>) }
      </div>
    );
  }

  renderCards() {
    const { services } = this.props;
    const { modelRepositoriesStore } = stores;
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
    const { configStore } = stores;

    if (configStore.isComponentBlacklisted("PredictServiceList"))
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
}));
export default PredictServiceList;
