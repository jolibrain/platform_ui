import React from "react";
import PropTypes from "prop-types";

import { toJS } from "mobx";
import { observer } from "mobx-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

@observer
export default class PerClassArray extends React.Component {
  render() {
    const { service, measureKey } = this.props;

    let measure, measure_hist;
    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure = service.measure;
      measure_hist = service.measure_hist;
    }

    let classNames = [];

    let value = "--";
    try {
      value = measure[measureKey].toFixed(5);
    } catch (e) {
      // measure[measureKey].toFixed is not a function
    }

    let measureHistIndex = `${measureKey}_hist`;
    let sparkData = [];

    // display color levels for clacc
    if (measureKey.includes("clacc")) {
      if (value > 0) classNames.push("clacc-level-0");
      if (value > 0.55) classNames.push("clacc-level-warning");
      if (value > 0.9) classNames.push("clacc-level-success");
    }

    if (
      measure_hist &&
      measure_hist[measureHistIndex] &&
      measure_hist[measureHistIndex].length > 0
    ) {
      sparkData = toJS(measure_hist[measureHistIndex]).map(x =>
        parseInt(x * 100, 10)
      );
    }

    return (
      <tr key={`measureKey-${measureKey}`}>
        <th scope="row" className="sparkline">
          <Sparklines data={sparkData} min={0} max={100}>
            <SparklinesLine color="#102a42" />
          </Sparklines>
        </th>
        <td>
          <h3>{value}</h3>
          <h4>{measureKey}</h4>
        </td>
      </tr>
    );
  }
}

PerClassArray.propTypes = {
  service: PropTypes.object.isRequired
};
