import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import CreateCard from "./CreateCard";

@inject("modelRepositoriesStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceCardCreate extends React.Component {
  cardArray(repositories) {
    const { filterServiceName } = this.props;

    return repositories
      .filter(r => {
        return filterServiceName ? r.name.includes(filterServiceName) : true;
      })
      .map((repository, index) => {
        return (
          <CreateCard
            key={`${index}-${repository.name}`}
            repository={repository}
          />
        );
      });
  }

  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceCardCreate"))
      return null;

    const {
      publicRepositories,
      privateRepositories
    } = this.props.modelRepositoriesStore;

    return (
      <div>
        <div className="serviceQuickCreate card-columns">
          {this.cardArray(publicRepositories)}
        </div>
        <hr />
        <div className="serviceQuickCreate card-columns">
          {this.cardArray(privateRepositories)}
        </div>
      </div>
    );
  }
}

ServiceCardCreate.propTypes = {
  services: PropTypes.array.isRequired,
  filterServiceName: PropTypes.string
};
