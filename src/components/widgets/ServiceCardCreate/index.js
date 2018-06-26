import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import CreateCard from "./CreateCard";

@inject("modelRepositoriesStore")
@withRouter
@observer
export default class ServiceCardCreate extends React.Component {
  render() {
    const repositories = this.props.modelRepositoriesStore.repositories;

    return (
      <div className="serviceQuickCreate card-columns">
        {repositories.map((repository, index) => {
          return <CreateCard key={index} repository={repository} />;
        })};
      </div>
    );
  }
}
