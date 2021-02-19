import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import moment from "moment"

import PredictItem from "./Predict";
import TrainingItem from "./Training";
import ModelRepositoryItem from "./ModelRepository";
import DatasetItem from "./Dataset";

@withRouter
@observer
class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          text: "",
          type: "selector",
          hide: false,
          toggable: false
        },
        {
          text: "",
          selector: "name",
          hide: false,
          toggable: false,
          formatter: (value, service) => {

            const configBadge = service.jsonConfig ? (
              <a
                href={`${service.path}config.json`}
                className="badge badge-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                config
              </a>
            ) : null;

            const metricsBadge = service.jsonMetrics ? (
              <a
                href={`${service.path}metrics.json`}
                className="badge badge-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                metrics
              </a>
            ) : null;

            return (
              <>
                {value}
                <br/>
                {configBadge}
                {metricsBadge}
              </>
            )
          }
        },
        {
          text: "Date",
          selector: "metricsDate",
          hide: true,
          toggable: true,
          formatter: (value, service) => {
            return moment(value).format("L LT");
          }
        },
        {
          text: "Tags",
          selector: "path",
          hide: false,
          toggable: false,
          formatter: (value) => {
            const tags = value
                  .split("/")
                  .slice(0, -2)
                  .filter(item => {
                    return item.length > 0 &&
                      !["models", "training"].includes(item)
                  })

            return (
              <div>
                {
                  tags.map(
                    (tag, i) =>
                      <span
                        key={i}
                        className="badge badge-filter"
                        onClick={this.handleFilterClick}
                      >
                        {tag}
                      </span>
                  )
                }
              </div>
            )
          }
        },
        {
          text: "Type",
          selector: "mltype",
          hide: true,
          toggable: true
        },
        {
          text: "Iterations",
          selector: "iterations",
          isValue: true,
          hide: true,
          toggable: true
        },
        {
          text: "Train Loss",
          selector: "train_loss",
          isValue: true,
          hide: false,
          toggable: true,
          bestValueCallback: this.bestMinValue,
          formatter: this.formatFloatValue
        },
        {
          text: "Mean IOU",
          selector: "meaniou",
          isValue: true,
          hide: true,
          toggable: true,
          bestValueCallback: this.bestMaxValue,
          formatter: this.formatFloatValue
        },
        {
          text: "MAP",
          selector: "map",
          isValue: true,
          hide: false,
          toggable: true,
          bestValueCallback: this.bestMaxValue,
          formatter: this.formatFloatValue
        },
        {
          text: "Accuracy",
          selector: "acc",
          isValue: true,
          hide: true,
          toggable: true,
          bestValueCallback: this.bestMaxValue,
          formatter: this.formatFloatValue
        },
        {
          text: "F1",
          selector: "f1",
          isValue: true,
          hide: true,
          toggable: true,
          bestValueCallback: this.bestMaxValue,
          formatter: this.formatFloatValue
        },
        {
          text: "Mcll",
          selector: "mcll",
          isValue: true,
          hide: true,
          toggable: true,
          bestValueCallback: this.bestMinValue,
          formatter: this.formatFloatValue
        },
        {
          text: "Eucll",
          selector: "eucll",
          isValue: true,
          hide: true,
          toggable: true,
          bestValueCallback: this.bestMinValue,
          formatter: this.formatFloatValue
        },
        {
          text: "",
          selector: "",
          hide: false,
          toggable: false,
          isAction: true
        }
      ]
    }

    this.toggleColumn = this.toggleColumn.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this)

    this.formatFloatValue = this.formatFloatValue.bind(this);
    this.bestMinValue = this.bestMinValue.bind(this);
    this.bestMaxValue = this.bestMaxValue.bind(this);
  }

  formatFloatValue(value) {
    let content = value;

    if(!isNaN(value)) {
      content = parseFloat(value).toFixed(5);
    }

    return content;
  }

  bestMinValue(histValues) {
    return Math.min.apply(Math, histValues);
  }

  bestMaxValue(histValues) {
    return Math.max.apply(Math, histValues);
  }

    handleFilterClick(event){
        const { handlePathFilter } = this.props;

        // missing prop
        if(!handlePathFilter)
            return null;

        handlePathFilter(event.target.innerHTML);
    }

    toggleColumn(columnText) {

        const newColumns = this.state.columns.map((column, index) => {
            if(column.text === columnText) {
                const newColumn = {...column}
                newColumn.hide = !newColumn.hide
                return newColumn;
            }

            return column;
        })

        this.setState({
            ...this.state,
            columns: newColumns
        })

    }

    render() {

        const {
            services
        } = this.props;

        const tableHeadContent = (
            <tr>
              {
                  this.state.columns
                      .filter(column => !column.hide)
                      .map((column, index) =>
                              <th key={index} scope="col">{column.text}</th>
                      )
              }
            </tr>
        );

        const tableBodyContent = services.map((service, index) => {

            let item = null;

            if (service.isRepository) {

                item = (
                    <ModelRepositoryItem
                      key={index}
                      service={service}
                      columns={this.state.columns}
                      {...this.props}
                    />
                );

            } else if (service.isDataset) {

                item = (
                    <DatasetItem
                      key={index}
                      dataset={service}
                      columns={this.state.columns}
                      {...this.props}
                    />
                );

            } else if (
                service.settings &&
                    service.settings.training
            ) {

                item = (
                    <TrainingItem
                      key={index}
                      service={service}
                      columns={this.state.columns}
                      {...this.props}
                    />
                );

            } else {

                item = (
                    <PredictItem
                      key={index}
                      service={service}
                      columns={this.state.columns}
                      {...this.props}
                    />
                );

            }

            return item;

        });

        const columnsFilter = (
            <div className="col column-filters text-right">
            {
                this.state.columns
                    .filter(column => column.toggable)
                    .map((column, index) => {
                    return (<span key={index}>
                          <input
                            type="checkbox"
                            checked={!column.hide}
                            onChange={
                                this.toggleColumn.bind(this, column.text)
                            } /> {column.text}
                            </span>);

                })
            }
            </div>
        );

                return (
                    <>
                      {columnsFilter}
                    <table className="table">
                    <thead>
                      { tableHeadContent }
                    </thead>
                    <tbody>
                      { tableBodyContent }
                    </tbody>
                    </table>
                    </>
                );

    }

}

Table.propTypes = {
    services: PropTypes.array.isRequired,
    handleCompareStateChange: PropTypes.func,
    handlePathFilter: PropTypes.func,
};
export default Table;
