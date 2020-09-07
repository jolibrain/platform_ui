import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("configStore")
@observer
class TrainingMeasure extends React.Component {
  render() {
    const { service } = this.props;

    let measure = null;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
    } else {
      measure = service.measure;
    }

    if (
      this.props.configStore.isComponentBlacklisted("TrainingMeasure") ||
      !measure
    )
      return null;

    const measureKeys = Object.keys(measure)
      .sort()
      .filter(
        k =>
          k !== "remain_time_str" &&
          k !== "remain_time" &&
          k !== "iter_time" &&
          k !== "iteration" &&
          k !== "train_loss" &&
          k !== "labels" &&
          k !== "cmfull" &&
          k !== "cmdiag"
      );

    if (measureKeys.length === 0) return null;

    return (
      <div className="trainingmeasure">
        <h5>
          <i className="fas fa-braille" /> Training Measures
        </h5>
        <div className="fluid-container">
          {measureKeys.map((key, index) => {
            return (
              <div
                className={
                  this.props.hoveredMeasure === index ? "row hovered" : "row"
                }
                key={index}
                onMouseEnter={this.props.handleOverMeasure.bind(this, index)}
                onMouseLeave={this.props.handleLeaveMeasure.bind(this)}
              >
                <div className="col-sm-1 text-right index">{index + 1}</div>
                <div className="col-sm-8">{key}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

TrainingMeasure.propTypes = {
  service: PropTypes.object.isRequired,
  handleOverMeasure: PropTypes.func.isRequired,
  handleLeaveMeasure: PropTypes.func.isRequired,
  hoveredMeasure: PropTypes.number.isRequired
};
export default TrainingMeasure;
