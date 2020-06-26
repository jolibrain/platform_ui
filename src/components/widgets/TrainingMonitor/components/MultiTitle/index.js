import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import TitleItem from "./TitleItem";

@observer
export default class MultiTitle extends React.Component {
  render() {
    const {
      services,
      hiddenRepositoriesIndexes,
      handleRepositoryVisibility
    } = this.props;

    return (
      <table className="title trainingmonitor-multititle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Train Loss</th>
            <th>Iterations</th>
            <th>Iteration (best)</th>
            <th>MAP (best)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => {
            return (
              <TitleItem
                key={`title-${service.name}`}
                service={service}
                serviceIndex={index}
                isVisible={hiddenRepositoriesIndexes.includes(index)}
                handleRepositoryVisibility={handleRepositoryVisibility}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}

MultiTitle.propTypes = {
  services: PropTypes.array.isRequired,
  hiddenRepositoriesIndexes: PropTypes.array,
  handleRepositoryVisibility: PropTypes.func
};
