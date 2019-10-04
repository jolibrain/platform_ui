import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Table from "./Table";

@observer
export default class MeasureHistArray extends React.Component {
  render() {
    const { service } = this.props;

    if (!service.jsonMetrics && !service.respTrainMetrics) return null;

    let measureHistKeys = Object.keys(service.measure_hist)
      .sort()
      .filter(k => k !== "iteration_hist" && k !== "train_loss_hist");

    if (measureHistKeys.length === 0) return null;

    return (
      <div className="trainingmonitor-perclassarray" refresh={service.refresh}>
        <h4>Measures</h4>
        {measureHistKeys.length > 6 ? (
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <Table
                measureHistKeys={measureHistKeys.slice(
                  0,
                  parseInt(measureHistKeys.length / 3, 10)
                )}
                {...this.props}
              />
            </div>

            <div className="col-lg-4 col-md-12">
              <Table
                measureHistKeys={measureHistKeys.slice(
                  parseInt(measureHistKeys.length / 3, 10),
                  parseInt(measureHistKeys.length / 3, 10) * 2
                )}
                {...this.props}
              />
            </div>

            <div className="col-lg-4 col-md-12">
              <Table
                measureHistKeys={measureHistKeys.slice(
                  parseInt(measureHistKeys.length / 3, 10) * 2
                )}
                {...this.props}
              />
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <Table measureHistKeys={measureHistKeys} {...this.props} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

MeasureHistArray.propTypes = {
  service: PropTypes.object.isRequired
};
