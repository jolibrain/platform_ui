import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class TitleItem extends React.Component {
  constructor(props) {
    super(props);
    this.getValue = this.getValue.bind(this);
  }

  getValue(attr) {
    const { service } = this.props;

    let measure, measure_hist;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.measure;
      measure_hist = service.measure_hist;
    }

    let value = null;

    if (measure) {
      value = measure[attr];
    } else if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attr}_hist`][measure_hist[`${attr}_hist`].length - 1];
    }

    return value ? parseFloat(value) : "--";
  }

  render() {
    const {
      service,
      serviceIndex,
      isVisible,
      handleRepositoryVisibility
    } = this.props;

    let measure = null;

    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
    } else {
      measure = service.measure;
    }

    let trainLossValue = this.getValue("train_loss");

    if (typeof trainLossValue.toFixed === "function") {
      if (trainLossValue > 1) {
        trainLossValue = trainLossValue.toFixed(3);
      } else {
        // Find position of first number after the comma
        const zeroPosition = trainLossValue
          .toString()
          .split("0")
          .slice(2)
          .findIndex(elem => elem.length > 0);

        trainLossValue = trainLossValue.toFixed(zeroPosition + 4);
      }
    }

    const iterationsValue =
      measure && measure.iteration ? measure.iteration : "--";

    const iterationBestValue =
      service.bestModel && service.bestModel.iteration
        ? service.bestModel.iteration
        : "--";

    const mapBestValue =
      service.bestModel && service.bestModel.map ? service.bestModel.map : "--";

    return (
      <tr>
        <td className={`chart-cell-${serviceIndex}`}>{service.name}</td>
        <td>{trainLossValue}</td>
        <td>{iterationsValue}</td>
        <td>{iterationBestValue}</td>
        <td>{mapBestValue}</td>
        <td>
          <a
            href={`${service.path}config.json`}
            className="badge badge-dark"
            target="_blank"
          >
            config
          </a>
          <br />
          <a
            href={`${service.path}metrics.json`}
            className="badge badge-dark"
            target="_blank"
          >
            metrics
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
  serviceIndex: PropTypes.number
};
