import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Card from "./components/Card";
import ListItem from "./components/ListItem";

@inject("configStore")
@withRouter
@observer
export default class PredictServiceList extends React.Component {
  renderCards() {
    const { services } = this.props;
    return (
      <div id="predictServiceList" className="serviceQuickCreate row">
        {services.map((service, index) => {
          return <Card key={`${index}-${service.name}`} repository={service} />;
        })}
      </div>
    );
  }

  renderList() {
    const { services } = this.props;
    return (
      <div
        id="predictServiceList"
        className="serviceQuickCreate container-fluid"
      >
        {services.map((service, index) => {
          return (
            <ListItem key={`${index}-${service.name}`} repository={service} />
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
