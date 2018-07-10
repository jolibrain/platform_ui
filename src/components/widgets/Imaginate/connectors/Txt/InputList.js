import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class InputList extends React.Component {
  constructor(props) {
    super(props);

    this.selectInput = this.selectInput.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
  }

  selectInput(index) {
    const store = this.props.imaginateStore;
    store.service.selectedInputIndex = index;
    store.predict();
  }

  handleClearAll() {
    const { service } = this.props.imaginateStore;
    service.clearAllInputs();
  }

  handleClearInput(index) {
    const { service } = this.props.imaginateStore;
    service.clearInput(index);
  }

  render() {
    const { service } = this.props.imaginateStore;

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
                    inputIndex === service.selectedInputIndex
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
}
