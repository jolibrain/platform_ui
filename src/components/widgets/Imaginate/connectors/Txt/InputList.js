import React from "react";
import { observer } from "mobx-react";

import stores from "../../../../../stores/rootStore";

const InputList = observer(class InputList extends React.Component {
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

    const inputs = service.inputs;

    return (
      <div className="col-md-12">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={this.handleClearAll}
        >
          Delete All
        </button>
        <ul className="list-group">
          {inputs
            .slice()
            .reverse()
            .map((input, index) => {
              const inputIndex = inputs.length - index - 1;
              return (
                <li
                  key={`input-${index}`}
                  className={
                    input.isActive
                      ? "list-group-item active"
                      : "list-group-item"
                  }
                  onClick={this.selectInput.bind(this, inputIndex)}
                >
                  {input.content}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={this.handleClearInput.bind(this, inputIndex)}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
});
export default InputList;
