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
    store.setSelectedInput(index);
  }

  render() {
    const store = this.props.imaginateStore;

    if (!store.service) return null;

    return (
      <div id="carousel">
        {store.service.inputs.map((input, index) => {
          return (
            <div key={`img-${index}`} className="slide">
              <img
                src={input.content}
                key={`img-${index}`}
                className="img-block"
                alt=""
                onClick={this.selectInput.bind(this, index)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
