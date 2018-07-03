import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class ImageList extends React.Component {
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
      <div id="carousel">
        {inputs.reverse().map((input, index) => {
          const inputIndex = inputs.length - index - 1;
          return (
            <div key={`img-${index}`} className="slide">
              <img
                src={input.content}
                key={`img-${index}`}
                className={
                  inputIndex === service.selectedInputIndex
                    ? "img-block active"
                    : "img-block"
                }
                alt=""
                onClick={this.selectInput.bind(this, inputIndex)}
              />
              <i
                onClick={this.handleClearInput.bind(this, inputIndex)}
                className="deleteImg fas fa-times-circle"
              />
            </div>
          );
        })}
      </div>
    );
  }
}