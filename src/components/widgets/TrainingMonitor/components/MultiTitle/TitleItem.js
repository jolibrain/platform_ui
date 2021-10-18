import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class TitleItem extends React.Component {
  constructor(props) {
    super(props);
    this.getValue = this.getValue.bind(this);
    this.getBestValue = this.getBestValue.bind(this);
    this.getMeasureValue = this.getMeasureValue.bind(this);
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

  getMeasureValue(selector) {

    const { service } = this.props;

    let value = '--';
    let measure = null;

    if (service.jsonMetrics) {
      measure = service.jsonMetrics.body.measure;
    } else {
      measure = service.measure;
    }

    if (measure && measure[selector])
      value = measure[selector];

    return value;

  }

  getBestValue(selector) {

    const { service } = this.props;
    let value = '--';

    if(service.bestModel && service.bestModel[selector])
        value = service.bestModel[selector]

    return value;
  }

  render() {
    const {
      service,
      tableColumns
    } = this.props;

    return (
      <tr>
        {
          tableColumns.map( (column, index) => {

            const className = column.classNameFormatter ?
              column.classNameFormatter(this.props) : null

            let value = null;

            if (column.isBest) {
              value = this.getBestValue(column.selector);
            } else if (column.isMeasure) {
              value = this.getMeasureValue(column.selector);
            } else if (column.isValue) {
              value = this.getValue(column.selector);
            } else {
              value = service[column.selector]
            }

            return <td
                     key={`column-${index}`}
                     className={className}
                   >
                     {
                       column.formatter ?
                         column.formatter(value, this.props) : value
                     }
                   </td>;
          })
        }
      </tr>
    );
  }
}

TitleItem.propTypes = {
  service: PropTypes.object.isRequired,
  serviceIndex: PropTypes.number
};
export default TitleItem;
