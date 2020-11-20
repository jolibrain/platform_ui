import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import DataTable from 'react-data-table-component';
import { readString } from 'react-papaparse'

import FileListSelector from "../commons/FileListSelector";
import InputForm from "../commons/InputForm";
import CardCommands from "../commons/CardCommands";

@inject("imaginateStore")
@inject("dataRepositoriesStore")
@withRouter
@observer
class CsvConnector extends React.Component {

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
    const { dataRepositoriesStore } = this.props;

    if (dataRepositoriesStore.loaded === false) {
      dataRepositoriesStore.refresh();
    }
  }

  render() {
    const { service } = this.props.imaginateStore;

    if (!service) return null;

    const input = service.selectedInput;

    const ResultCell = ({row, column, rowIndex, colIndex}) => {

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

      const value = parseFloat(row[column.selector]).toFixed(5);

      if ( value.toString() === "NaN" ) {
        return null;
      }

      return (
        <div style={{
          "white-space": "nowrap",
          "overflow": "hidden",
          "text-overflow": "ellipsis",
        }}>
          {}
          <div>{value}</div>
          <div>
            {}
            {resultBadge}
          </div>
        </div>
      );

    };

    // Build table columns based on input csv meta fields
    let tableColumns = [];
    if (
      input &&
        input.csv &&
        input.csv.meta &&
        input.csv.meta.fields
    ) {

      if ( input.csv.meta.fields.includes("timestamp") ) {
        tableColumns.push({
          name: "Timestamp",
          selector: "timestamp"
        })
      }

      tableColumns = tableColumns.concat(input.csv.meta.fields
        .filter(f => f !== "timestamp")
        .map((f, colIndex) => {
          return {
            name: f && f[0].toUpperCase() + f.slice(1),
            selector: f,
            cell: (row, index, column, id) => <ResultCell
                           row={row}
                           column={column}
                           rowIndex={index}
                           colIndex={colIndex}
                         />
          }
        })
      )
    }

    // Build table data based on input csv data
    let tableData = [];
    if (
      input &&
        input.csv &&
        input.csv.data
    ) {
      tableData = input.csv.data;
    }

    return (
      <div className="imaginate" data-refresh={service.refresh}>
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
}
export default CsvConnector;
