import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class InputList extends React.Component {
  constructor(props) {
    super(props);

    this.selectInput = this.selectInput.bind(this);
  }

  selectInput(index) {
    const store = this.props.imaginateStore;
    store.service.selectedInputIndex = index;
    store.predict();
  }

  render() {
    const { service } = this.props.imaginateStore;

    if (!service) return null;

    const inputs = service.inputs;

    return (
      <ul className="list-group">
        {inputs.reverse().map((input, index) => {
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
            </li>
          );
        })}
      </ul>
    );
  }
}
