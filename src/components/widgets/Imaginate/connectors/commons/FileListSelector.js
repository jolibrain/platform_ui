/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { observer } from "mobx-react";

import stores from "../../../../../stores/rootStore";

const FileListSelector = observer(class FileListSelector extends React.Component {
  constructor(props) {
    super(props);

    this.selectInput = this.selectInput.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
  }

  selectInput(index) {
    const { imaginateStore } = stores;
    imaginateStore.service.selectInput(index);
    imaginateStore.predict();
  }

  handleClearAll() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.clearAllInputs();
  }

  handleClearInput(index) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.clearInput(index);
  }

  render() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;

    if (!service) return null;

    let inputs = service.inputs;

    if (inputs.length === 0) {
      return (
        <div className="alert alert-warning" role="alert">
          {this.props.notFoundError}
        </div>
      );
    } else {
        inputs = inputs.map((input, index) => {

            const inputClassname = input.isActive ?
                  "list-group-item active" : "list-group-item"
            return (
                <li
                  key={`file-${index}`}
                  className={inputClassname}
                  onClick={this.selectInput.bind(this, index)}
                >
                  {input.path} -
                  {input.path.split(/[\\/]/).pop()}
                  <i
                    onClick={this.handleClearInput.bind(this, index)}
                    className="deleteInput fas fa-times-circle"
                  />
                </li>
            );
        });

      if (inputs.length > 100) {
        inputs = inputs.slice(0, 100);
      }

      return (
        <ul className="list-group">
          {inputs}
        </ul>
      );
    }
  }
});
export default FileListSelector;
