import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class ImageList extends React.Component {
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
            </div>
          );
        })}
      </div>
    );
  }
}
