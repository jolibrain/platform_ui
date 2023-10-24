import React from "react";
import { observer } from "mobx-react";

const TitleItem = observer(class TitleItem extends React.Component {
  render() {
    const {
      service,
      serviceIndex,
      benchmark,
      isVisible,
      handleRepositoryVisibility
    } = this.props;

    const benchmarkHref = service.benchmarksPath + benchmark.href;
    const badgeIndex = serviceIndex % 8;

    return (
      <tr>
        <td>{service.name}</td>
        <td>{benchmark.name}</td>
        <td>
          {Math.max(
            ...benchmark.benchmark.map(b => parseInt(b.batch_size, 10))
          )}
        </td>
        <td>
          {Math.min(
            ...benchmark.benchmark.map(b => parseFloat(b.mean_processing_time))
          )}
        </td>
        <td>
          <a
            className="badge badge-dark"
            href={benchmarkHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {benchmark.href}
          </a>
          <br/>
          <a
            className="badge badge-dark"
            href={service.path + "config.json"}
            target="_blank"
            rel="noopener noreferrer"
          >
            config.json
          </a>
        </td>
        <td>
          <i
            className={`chart-badge-${badgeIndex} fa fa-2x fa-toggle-${
              isVisible ? "off" : "on"
            }`}
            onClick={handleRepositoryVisibility.bind(this, serviceIndex)}
          />
        </td>
      </tr>
    );
  }
});
export default TitleItem;
