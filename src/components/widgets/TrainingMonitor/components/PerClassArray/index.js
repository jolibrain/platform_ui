import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Table from "./Table";

@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service } = this.props;

    let measure;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
    } else {
      measure = service.measure;
    }

    if (!measure) return null;

    let measureKeys = Object.keys(measure)
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

    //if (
    //Object.keys(measure).includes("cmdiag") &&
    //Object.keys(measure).includes("labels")
    //) {
    //measure.labels.forEach(label => {
    //measureKeys.push(`cmdiag_${label}`);
    //});
    //}

    return (
      <div className="perClassArray" refresh={service.refresh}>
        <h4>Measures</h4>
        {measureKeys.length > 6 ? (
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <Table
                measureKeys={measureKeys.slice(
                  0,
                  parseInt(measureKeys.length / 3, 10)
                )}
                {...this.props}
              />
            </div>

            <div className="col-md-4 col-sm-12">
              <Table
                measureKeys={measureKeys.slice(
                  parseInt(measureKeys.length / 3, 10),
                  parseInt(measureKeys.length / 3, 10) * 2
                )}
                {...this.props}
              />
            </div>

            <div className="col-md-4 col-sm-12">
              <Table
                measureKeys={measureKeys.slice(
                  parseInt(measureKeys.length / 3, 10) * 2
                )}
                {...this.props}
              />
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <Table measureKeys={measureKeys} {...this.props} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

PerClassArray.propTypes = {
  service: PropTypes.object.isRequired
};
