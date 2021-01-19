import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import DataTable from 'react-data-table-component';
import moment from 'moment';


@withRouter
@observer
class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hideMlType: false,
            hideIterations: false,
            hideTrainLoss: false,
            hideMeanIou: false,
            hideMap: false,
            hideAccuracy: false,
            hideF1: false,
            hideMcll: false,
            hideEucll: false,
        }

        this.toggleColumn = this.toggleColumn.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    toggleColumn(columnKey) {
        this.setState({ [columnKey]: !this.state[columnKey] })
    }

    getValue(service, attr) {
        const { measure, measure_hist } = service;

        let value = null

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

        if (value && !["remain_time_str", "iteration"].includes(attr)) {
        if (attr === "train_loss") {
            value = parseFloat(value);

            if (typeof value.toFixed === "function") {
            if (value > 1) {
                value = value.toFixed(3);
            } else {
                // Find position of first number after the comma
                const zeroPosition = value
                .toString()
                .split("0")
                .slice(2)
                .findIndex(elem => elem.length > 0);

                value = value.toFixed(zeroPosition + 4);
            }
            }
        } else {
            value = value.toFixed(5);
        }
        }

        return value;
    }

    render() {

        const {
            services
        } = this.props;

        const {
            hideMlType,
            hideIterations,
            hideTrainLoss,
            hideMeanIou,
            hideMap,
            hideAccuracy,
            hideF1,
            hideMcll,
            hideEucll,
        } = this.state;

        const dataTableColumns = [
            {
                name: 'Name',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Date',
                selector: 'date',
                sortable: true,
                sortFunction: (a, b) => {
                    return moment(a.date).diff(b.date);
                },
                format: (row, index) => {
                    return moment(row.date).format("L")
                }
            },
            {
                name: 'Type',
                selector: 'mltype',
                sortable: true,
                omit: hideMlType,
            },
            {
                name: 'Iterations',
                selector: 'iterations',
                sortable: true,
                omit: hideIterations,
            },
            {
                name: 'Train Loss',
                selector: 'train_loss',
                sortable: true,
                omit: hideTrainLoss,
            },
            {
                name: 'Mean IOU',
                selector: 'meaniou',
                sortable: true,
                omit: hideMeanIou,
            },
            {
                name: 'MAP',
                selector: 'map',
                sortable: true,
                omit: hideMap,
            },
            {
                name: 'Accuracy',
                selector: 'accuracy',
                sortable: true,
                omit: hideAccuracy,
            },
            {
                name: 'F1',
                selector: 'f1',
                sortable: true,
                omit: hideF1,
            },
            {
                name: 'mcll',
                selector: 'mcll',
                sortable: true,
                omit: hideMcll,
            },
            {
                name: 'eucll',
                selector: 'eucll',
                sortable: true,
                omit: hideEucll,
            },
        ];

        const serviceData = services.map(service => {

            const mltype = service.jsonMetrics
            ? service.jsonMetrics.body.mltype
            : null;

            return {
                name: service.name,
                date: service.metricsDate,
                mltype: mltype,
                train_loss: this.getValue(service, "train_loss"),
                meaniou: this.getValue(service, "meaniou"),
                map: this.getValue(service, "map"),
                accuracy: this.getValue(service, "acc"),
                f1: this.getValue(service, "f1"),
                mcll: this.getValue(service, "mcll"),
                eucll: this.getValue(service, "eucll"),
            }
        })

        return (
            <>
              <DataTable
                columns={dataTableColumns}
                data={serviceData}
                selectableRows
                subHeader
                subHeaderComponent={
                    (
                  <div className="subheader">
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideMlType}
                        onChange={
                            this.toggleColumn.bind(this, "hideMlType")
                        } /> ML Type
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideIterations}
                        onChange={
                            this.toggleColumn.bind(this, "hideIterations")
                        } /> Iterations
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideTrainLoss}
                        onChange={
                            this.toggleColumn.bind(this, "hideTrainLoss")
                        } /> Train Loss
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideMeanIou}
                        onChange={
                            this.toggleColumn.bind(this, "hideMeanIou")
                        } /> Mean IOU
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideMap}
                        onChange={
                            this.toggleColumn.bind(this, "hideMap")
                        } /> MAP
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideAccuracy}
                        onChange={
                            this.toggleColumn.bind(this, "hideAccuracy")
                        } /> Accuracy
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideF1}
                        onChange={
                            this.toggleColumn.bind(this, "hideF1")
                        } /> F1
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideMcll}
                        onChange={
                            this.toggleColumn.bind(this, "hideMcll")
                        } /> Mcll
                    </span>
                    <span>
                      <input
                        type="checkbox"
                        checked={!hideEucll}
                        onChange={
                            this.toggleColumn.bind(this, "hideEucll")
                        } /> Eucll
                    </span>
                  </div>
                    )
                }
              />
            </>
        );

    }

}

Table.propTypes = {
    services: PropTypes.array.isRequired,
    handleCompareStateChange: PropTypes.func,
};
export default Table;
