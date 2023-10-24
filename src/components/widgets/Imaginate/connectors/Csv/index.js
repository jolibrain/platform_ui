import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import DataTable from 'react-data-table-component';
import { readString } from 'react-papaparse'

import FileListSelector from "../commons/FileListSelector";
import InputForm from "../commons/InputForm";
import CardCommands from "../commons/CardCommands";

import ChartColumn from "./ChartColumn";

import stores from "../../../../../stores/rootStore";

const CsvConnector = withRouter(observer(class CsvConnector extends React.Component {

  constructor(props) {
    super(props);
    this.loadCsvInputs = this.loadCsvInputs.bind(this);
  }

  // callback after input fetching, it loads csv content
  // from csv files found on server
  loadCsvInputs(inputs) {
    inputs.forEach(async (input) => {
      const content = await input.loadContent()
      input.csv = readString(content, {header: true});
    })
  }

  componentDidMount() {
    const { dataRepositoriesStore } = stores;

    if (dataRepositoriesStore.loaded === false) {
      dataRepositoriesStore.refresh();
    }
  }

  render() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    if (!service) return null;

    const input = service.selectedInput;

    let tableColumns = [],
        tableData = [];

    if (input && input.csv) {

      // Build table data based on input csv data
      if( input.csv.data ) {
        tableData = input.csv.data;
      }

      // Build table columns based on input csv meta fields
      if( input.csv.meta && input.csv.meta.fields) {

        // Include timestamp column if present in csv meta fields
        if ( input.csv.meta.fields.includes("timestamp") ) {
          tableColumns.push({
            name: "Timestamp",
            selector: "timestamp"
          })
        }

        // Decorate non-timestamp columns
        // ResultCell allows display of predict result for each cell
        // as a badge-displayed value
        tableColumns = tableColumns.concat(input.csv.meta.fields
          .filter(f => f !== "timestamp")
          .map((f, colIndex) => {
            return {
              name: f && f[0].toUpperCase() + f.slice(1),
              selector: f,
              cell: (row, rowIndex, column) => {
                const value = parseFloat(row[column.selector]).toFixed(5);

                if ( value.toString() === "NaN" ) {
                  return null;
                }

                let resultBadge = null;

                if (
                  input &&
                    input.json &&
                    input.json.body &&
                    input.json.body.predictions &&
                    input.json.body.predictions[0] &&
                    input.json.body.predictions[0].series &&
                    input.json.body.predictions[0].series[rowIndex] &&
                    input.json.body.predictions[0].series[rowIndex].out &&
                    input.json.body.predictions[0].series[rowIndex].out[colIndex]
                ) {
                  const badgeValue = input.json.body.predictions[0].series[rowIndex].out[colIndex];
                  resultBadge = (
                    <span className="badge badge-primary">
                      {parseFloat(badgeValue).toFixed(2)}
                    </span>
                  );
                }

                return (
                  <div className="resultCell">
                    <div>{value}</div>
                    <div>
                      {resultBadge}
                    </div>
                  </div>
                );
              }
            }
          })
        )

      }
    }

    // Display each csv column as a line chart
    let chartRows = [];
    if (
      input &&
        input.csv &&
        input.csv.meta &&
        input.csv.meta.fields &&
        input.csv.meta.fields.length > 0
    ) {
      chartRows = input.csv.meta.fields
                       .filter(f => f !== "timestamp")
                       .map((f, index) => {
                         return <ChartColumn
                                  key={`chartRow-${index}`}
                                  input={input}
                                  colIndex={index}
                                  colKey={f}
                      />
                       })
    }


    return (
      <div className="imaginate csvConnector" data-refresh={service.refresh}>
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <InputForm
                methodId="folderPath"
                isFolderSelectable
                uniqueMetod
                fileExtensionFilter={new RegExp(".csv$")}
                inputLoadCallback={this.loadCsvInputs}
              />
              <FileListSelector
                fileFilter="\.csv$"
                notFoundError="No CSV file found in selected path"
              />
            </div>

            { chartRows }

            <div className="row">
              <DataTable
                columns={tableColumns}
                data={tableData}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
}));
export default CsvConnector;
