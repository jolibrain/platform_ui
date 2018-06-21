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
    store.setSelectedInput(index);
  }

  render() {
    const store = this.props.imaginateStore;

    if (!store.service) return null;

    return (
      <ul className="list-group">
        {store.service.inputs.reverse().map((input, index) => {
          return (
            <li
              key={`input-${index}`}
              className={
                index === store.selectedInputIndex
                  ? "list-group-item active"
                  : "list-group-item"
              }
              onClick={this.selectInput.bind(this, index)}
            >
              {input.content}
            </li>
          );
        })}
      </ul>
    );
  }
}
