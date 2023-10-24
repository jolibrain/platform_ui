import React from "react";
import { observer } from "mobx-react";

import TitleItem from "./TitleItem";

const MultiTitle = observer(class MultiTitle extends React.Component {
  render() {
    const {
      services,
      hiddenRepositoriesIndexes,
      handleRepositoryVisibility
    } = this.props;

    if (!services || services.length === 0) return null;

    return (
      <table className="title benchmark-multititle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Benchmark Host</th>
            <th>Max Batch Size</th>
            <th>Best Mean Processing Time</th>
            <th>JSON</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services
            .filter(s => s)
            .map((service, serviceIndex) => {
              return service.benchmarks.map((benchmark, benchmarkIndex) => {
                return (
                  <TitleItem
                    key={`benchmark-${service.name}-${benchmarkIndex}`}
                    service={service}
                    benchmark={benchmark}
                    serviceIndex={serviceIndex}
                    isVisible={hiddenRepositoriesIndexes.includes(serviceIndex)}
                    handleRepositoryVisibility={handleRepositoryVisibility}
                  />
                );
              });
            })}
        </tbody>
      </table>
    );
  }
});
export default MultiTitle;
