import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class TitleItem extends React.Component {
  constructor(props) {
    super(props);
    this.getHistValue = this.getHistValue.bind(this);
    this.getBestValue = this.getBestValue.bind(this);
    this.getMeasureValue = this.getMeasureValue.bind(this);
  }

  getHistValue(attr) {
    const { service } = this.props;

    const measure_hist = service.jsonMetrics
      ? service.jsonMetrics.body.measure_hist
      : service.measure_hist;

    let value = '--';
    if (
      measure_hist &&
        Object.keys(measure_hist)
              .find(k => k.startsWith(attr))
    ) {
      const attrKeys = Object.keys(measure_hist)
                             .filter(k => k.startsWith(attr))
                             .filter(k => {
                               // Do not match testing keys
                               // example:
                               // ['map_test2', 'map_test1', 'map_1_test1', 'map_1_test2']
                               // should be sorted as
                               // ['map_test2', 'map_test1']
                               const re = new RegExp(`^${attr}_\\d+_.*$`, 'g');
                               return !k.match(re)
                             })
                             .sort((a, b) => {
                               // sort by measure_hist key
                               // example:
                               // ['map_test2', 'map_test1']
                               // should be sorted as
                               // ['map_test1', 'map_test2']
                               const indexAmatch = a.match(/\d+$/);
                               const indexBmatch = b.match(/\d+$/);
                               let indexA, indexB;
                               if(
                                 indexAmatch &&
                                   indexBmatch &&
                                   indexAmatch.length > 0 &&
                                   indexBmatch.length > 0
                               ) {
                                 indexA = parseInt([0], 10);
                                 indexB = parseInt(b.match(/\d+$/)[0], 10);
                               }
                               return (isNaN(indexA) ? 0 : indexA) - (isNaN(indexB) ? 0 : indexB)
                             })

      if(attrKeys.length === 1) {
        value =
          parseFloat(measure_hist[attrKeys[0]][measure_hist[attrKeys[0]].length - 1]).toFixed(5)
      } else if(attrKeys.length > 1) {
        value = attrKeys.map(k => {
          return parseFloat(measure_hist[k][measure_hist[k].length - 1]).toFixed(5);
        })
      }
    }

    return value;
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

              // if not found in measure hash,
              // try to fetch value inside measure_hist array
              if(value === '--') {
                value = this.getHistValue(column.selector);
              }

            } else if (column.isHistValue) {
              value = this.getHistValue(column.selector);
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
