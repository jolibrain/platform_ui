import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import DataTable from 'react-data-table-component';

import FileListSelector from "../commons/FileListSelector";
import InputForm from "../commons/InputForm";
import CardCommands from "../commons/CardCommands";

@inject("imaginateStore")
@inject("dataRepositoriesStore")
@withRouter
@observer
class CsvConnector extends React.Component {

  componentDidMount() {
    const { dataRepositoriesStore } = this.props;

    if (dataRepositoriesStore.loaded === false) {
      dataRepositoriesStore.refresh();
    }
  }

  render() {
    const { service } = this.props.imaginateStore;

    if (!service) return null;

      const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982' }];

      const columns = [
          {
              name: 'Title',
              selector: 'title',
              sortable: true,
          },
          {
              name: 'Year',
              selector: 'year',
              sortable: true,
              right: true,
          },
      ];

    return (
      <div className="imaginate">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <InputForm
                methodId="folderPath"
                isFolderSelectable
                uniqueMetod
                fileFilter="\.csv$"
              />
              <FileListSelector
                fileFilter="\.csv$"
                notFoundError="No CSV file found in selected path"
              />
            </div>


            <div className="row">
              <DataTable
                columns={columns}
                data={data}
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
