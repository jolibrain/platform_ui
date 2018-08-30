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

    const {
      publicRepositories,
      privateRepositories
    } = this.props.modelRepositoriesStore;

    return (
      <div>
        <div className="serviceQuickCreate card-columns">
          {publicRepositories.map((repository, index) => {
            return <CreateCard key={index} repository={repository} />;
          })}
        </div>
        <hr />
        <div className="serviceQuickCreate card-columns">
          {privateRepositories.map((repository, index) => {
            return <CreateCard key={index} repository={repository} />;
          })}
        </div>
      </div>
    );
  }
}
