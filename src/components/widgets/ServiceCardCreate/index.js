import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import CreateCard from "./CreateCard";

@inject("modelRepositoriesStore")
@inject("configStore")
@withRouter
@observer
export default class ServiceCardCreate extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceCardCreate"))
      return null;

    const repositories = this.props.modelRepositoriesStore.repositories;

    return (
      <div>
        <div className="serviceQuickCreate card-columns">
          {repositories
            .filter(repository => {
              return repository.label.indexOf("/public/") !== -1;
            })
            .map((repository, index) => {
              return <CreateCard key={index} repository={repository} />;
            })}
        </div>
        <hr />
        <div className="serviceQuickCreate card-columns">
          {repositories
            .filter(repository => {
              return repository.label.indexOf("/public/") === -1;
            })
            .map((repository, index) => {
              return <CreateCard key={index} repository={repository} />;
            })}
        </div>
      </div>
    );
  }
}
