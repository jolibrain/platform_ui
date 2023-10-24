/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { observer } from "mobx-react";

import stores from "../../../../../stores/rootStore";

const ImageList = observer(class ImageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: []
    };

    this.selectInput = this.selectInput.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
    this.handleClickRandomize = this.handleClickRandomize.bind(this);
  }

  componentWillMount() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    this.setState({ inputs: service.inputs });
  }

  componentWillReceiveProps(nextProps) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    this.setState({ inputs: service.inputs });
  }

  selectInput(index) {
    const { imaginateStore } = stores;
    const store = imaginateStore;
    store.service.selectInput(index);
    store.predict();
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

  handleClickRandomize() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.shuffleInputs();
    this.setState({ inputs: service.inputs });
  }

  render() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;

    if (!service) return null;

    let inputs = this.state.inputs.filter(i => {
      return /\.(jpe?g|png|gif|bmp)$/i.test(i.content.toLowerCase());
    });

    if (inputs.length === 0) {
      return (
        <div className="alert alert-warning" role="alert">
          No image found in selected path
        </div>
      );
    } else {
      inputs = inputs.map((input, index) => {
        return (
          <div key={`img-${index}`} className="slide">
            <img
              src={input.content}
              key={`img-${index}`}
              className={input.isActive ? "img-block active" : "img-block"}
              alt=""
              onClick={this.selectInput.bind(this, index)}
            />
            <i
              onClick={this.handleClearInput.bind(this, index)}
              className="deleteImg fas fa-times-circle"
            />
          </div>
        );
      });

      if (inputs.length > 100) {
        inputs = inputs.slice(0, 100);
      }

      return (
        <div id="carousel">
          <div className="slide">
            <a
              className="btn btn-outline-primary"
              role="button"
              onClick={this.handleClickRandomize}
            >
              <i className="fas fa-random" />
            </a>
          </div>
          {inputs}
        </div>
      );
    }
  }
});
export default ImageList;
