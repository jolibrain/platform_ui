import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class TitleItem extends React.Component {
  render() {
    const {
      service,
      serviceIndex,
      benchmark,
      isVisible,
      handleRepositoryVisibility
    } = this.props;

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
          <a className="badge badge-dark" href={benchmark.href} target="_blank">
            {benchmark.href}
          </a>
        </td>
        <td>
          <i
            className={`chart-badge-${serviceIndex} fa fa-2x fa-toggle-${
              isVisible ? "off" : "on"
            }`}
            onClick={handleRepositoryVisibility.bind(this, serviceIndex)}
          />
        </td>
      </tr>
    );
  }
}

TitleItem.propTypes = {
  service: PropTypes.object.isRequired,
  benchmark: PropTypes.object.isRequired,
  serviceIndex: PropTypes.number.isRequired
};
