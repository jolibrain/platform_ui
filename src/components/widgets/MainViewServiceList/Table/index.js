import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import moment from "moment"
import ReactPaginate from 'react-paginate';

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
      pagination: {
        offset: 0,
        perPage: 30
      },
      presets: [
        {
          name: "Timeseries",
          isActive: true,
          selectors: [
            "train_loss",
            "eucll",
            "L1_mean_error"
          ]
        },
        {
          name: "Detection",
          isActive: false,
          selectors: [
            "train_loss",
            "map"
          ]
        },
        {
          name: "Segmentation",
          isActive: false,
          selectors: [
            "train_loss",
            "meaniou",
            "accuracy"
          ]
        },
        {
          name: "Classification",
          isActive: false,
          selectors: [
            "train_loss",
            "acc",
            "f1"
          ]
        }
      ],
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
          toggable: false,
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
        // {
        //   text: "Type",
        //   selector: "mltype",
        //   hide: true,
        //   toggable: false
        // },
        {
          text: "Iterations",
          selector: "iteration",
          isValue: true,
          hide: false,
          //toggable: true
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
          hide: true,
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
          text: "L1 Mean Error",
          selector: "L1_mean_error",
          isValue: true,
          hide: false,
          toggable: true,
          bestValueCallback: this.bestMinValue,
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
          hide: false,
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
    this.handlePresetClick = this.handlePresetClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

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
    const { pagination } = this.state;
    const { handlePathFilter } = this.props;

    // missing prop
    if(!handlePathFilter)
      return null;

    handlePathFilter(event.target.innerHTML);

    this.setState({
      pagination: {
        offset: 0,
        perPage: pagination.perPage
      }
    })
  }

  handlePresetClick(event) {

    const presetName = event.target.innerHTML;
    const { columns, presets } = this.state;
    const selectedPreset = presets.find(p => {
      return p.name === presetName;
    });

    const newPresets = presets.map(preset => {
      const newPreset = {...preset}
      newPreset.isActive = preset.name === presetName
      return newPreset;
    })

    const newColumns = columns.map((column, index) => {
      if(column.toggable) {
        const newColumn = {...column}
        console.log(selectedPreset.selectors)
        console.log(column.selector)
        newColumn.hide = !selectedPreset.selectors.includes(
          column.selector
        )
        return newColumn;
      }

      return column;
    })

    this.setState({
      ...this.state,
      presets: newPresets,
      columns: newColumns
    })

  }

  handlePageClick(data) {
    const { pagination } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * pagination.perPage);

    this.setState({
      pagination: {
        offset: offset,
        perPage: pagination.perPage
      }
    });
  };

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

    const { pagination } = this.state;
    const pageCount = Math.ceil(services.length / pagination.perPage);
    const displayedServices = services.slice(
      pagination.offset,
      pagination.offset + pagination.perPage
    )

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

    const tableBodyContent = displayedServices.map((service, index) => {

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

    return (
      <>
        <div className="col text-right">
          <div className="btn-group btn-group-sm" role="group" aria-label="Metrics preset">
            {
              this.state.presets.map((p, index) => {
                return <button
                      key={index}
                        type={'button'}
                        className={
                          p.isActive ?
                            "btn btn-primary active" : "btn btn-primary"
                        }
                        onClick={this.handlePresetClick}
                      >
                        {p.name}
                      </button>
              })

            }
          </div>
        </div>
        <table className="table">
          <thead>
            { tableHeadContent }
          </thead>
          <tbody>
            { tableBodyContent }
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination justify-content-center'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-link'}
          nextClassName={'page-link'}
          activeClassName={'active'}
        />
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
